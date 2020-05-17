<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\Utils;
use App\InventoryItem;
use App\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use stdClass;

class TransactionController extends Controller
{
    use Utils;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth');
    }


    /**
     * handle add form data
     *
     * @param Request $request add item details
     * @return void
     */
    public function put(Request $request) {
        $data = json_decode($request->input('data'));

        $form_data = $data->form_details;
        $itm_bulk = $data->item_details->bulk;
        $itm_inv = $data->item_details->inv;
        $bulk_count = count($itm_bulk);
        $inv_count = count($itm_inv);

        if($bulk_count == 0 && $inv_count == 0){
            return response(' no items passed! ', 500);
        }

        $user = auth()->user();

        $transaction = new Transaction;
        $transaction->issuing_date = $form_data->date;
        $transaction->receipt_no = $form_data->issue_no;
        $transaction->received_by = $user->id;
        $transaction->receiving_station = $user->station_id;
        $transaction->transaction_type = "to_stock";
        $transaction->supplier = $form_data->supplier;
        $transaction->description = $form_data->description;
        $transaction->save();

        $attach_arr = [];

        for($i = 0; $i < $bulk_count; $i++){
            $attach_arr[$itm_bulk[$i]->item_id] = array('quantity' => $itm_bulk[$i]->quantity,
                'unit_price' => $itm_bulk[$i]->unit_price);
        }

        $transaction->bulk_items()->attach($attach_arr);

        $attach_arr = [];
        $itm_count = 0;

        for($i = 0; $i < $inv_count; $i++){
            $quan = $itm_inv[$i]->quantity;
            $itm_count += $quan;
            for($j = 0; $j < $quan; $j++){
                array_push($attach_arr,['item_id' => $itm_inv[$i]->item_id,
                    'price' => $itm_inv[$i]->unit_price, 'current_station' => $user->station_id]);
            }
        }

        DB::table('inventory_items')->insert($attach_arr);

        $last_id = DB::select('select LAST_INSERT_ID() as id');
        $first_id = $last_id[0]->id;
        $itm_ids = [];

        for($k = 0; $k < $itm_count; $k++){
            array_push($itm_ids, ($first_id + $k) );
        }

        $transaction->inventory_items()->attach($itm_ids);

        return $transaction->id;
    }


    /**
     * handle queries for saving issue request &
     *   send back updated item data
     *
     * @param Request $request issue details
     * @return Response
     */
    public function stock_issue(Request $request) {
        $issue = json_decode($request->input('issue'));

        $itm_bulk = $issue->items->bulk;
        $itm_inv = $issue->items->inv;
        $details = $issue->details;

        $transaction = new Transaction;
        $transaction->issuing_date = $details->isu_date;
        $transaction->received_by = $details->rcv_usr;
        $transaction->receiving_station = $details->rcv_stn;
        $transaction->issued_by = $details->isu_usr;
        $transaction->issuing_station = $details->isu_stn;
        $transaction->transaction_type = "stn_to_stn";
        $transaction->save();

        $attach_arr = [];
        $itm_count = count($itm_bulk);

        if($itm_count > 0) {
            for ($i = 0; $i < $itm_count; $i++) {
                $attach_arr[$itm_bulk[$i]->item_id] = array('quantity' => $itm_bulk[$i]->quantity);
            }

            $transaction->bulk_items()->attach($attach_arr);
        }

        $inv_count = count($itm_inv);

        if($inv_count > 0) {
            $itm_ids = [];

            foreach ($itm_inv as $itm) {
                $itm_count = intval($itm->quantity);
                $db_items = InventoryItem::where(
                    [
                        ['item_id', '=', $itm->item_id],
                        ['current_station', '=', $details->isu_stn],
                    ])
                    ->take($itm_count)
                    ->get();

                for ($n = 0; $n < $itm_count; $n++) {
                    $db_items[$n]->item_code = $itm->codes[$n]->code;
                    $db_items[$n]->serial_no = $itm->codes[$n]->serial;
                    $db_items[$n]->current_station = $details->rcv_stn;

                    $db_items[$n]->save();

                    array_push($itm_ids, $db_items[$n]->id);
                }
            }

            $transaction->inventory_items()->attach($itm_ids);
        }

        $avl_items = $this->get_items($details->isu_stn);

        if(is_array($avl_items)) {

            return response()->json(array("items" => $avl_items,
                "msg" => "transaction created for issue and items attached successfully", "t_id" => $transaction->id));
        }
        else {
            return response('item ' . $avl_items . ' has a negative quantity!', 500);
        }
    }


    /**
     * retrieve all receipts(transactions) of a particular station
     *
     * @param Request $request
     * @return array
     */
    public function receipts(Request $request) {
        //$station = auth()->user()->station_id;

        $trans = DB::select('select * from trans_info where rcv_stn_id = ? order by id desc', [$request->stn]);

        return $trans;
    }


    /**
     * retrieve all issues(transactions) of a particular station
     *
     * @return array
     */
    public function issues(Request $request) {
        //$station = auth()->user()->station_id;

        $trans = DB::select('select * from trans_info where isu_stn_id = ? order by id desc', [$request->stn]);

        return $trans;
    }


    /**
     * retrieve all transactions of a particular station
     *
     * @return array
     */
    public function all(Request $request) {

        $trans = DB::select('select * from trans_info where isu_stn_id = ? or rcv_stn_id = ? order by id desc',
            [$request->stn, $request->stn]);

        return response($trans);
    }


    /**
     * Retrieve all items of a transaction
     * use to handle stn_to_stn transactions
     * return object will contain bulk and inv items separately (with codes and serials)
     *
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function all_items($id) {
        $items = new stdClass();

        /** @noinspection SqlDialectInspection */
        $items->bulk = DB::select('select I.name, B.quantity 
                            from (transaction_bulk as B 
                                 join items as I on B.item_id = I.id)
                            where B.transaction_id = ?',
                            [ $id ]);

        /** @noinspection SqlDialectInspection */
        $itm_info = DB::select('select I.item_id, C.name, I.item_code, I.serial_no 
                            from (transaction_inventory as T 
                                join inventory_items as I on T.inventory_item_id = I.id
                                join items as C on I.item_id = C.id)
                            where T.transaction_id = ?  order by item_id',
                            [ $id ]);

        //$items->inv = $itm_info;

        $items->inv = $this->process_inv_info($itm_info);

        return response()->json($items);
    }


    /**
     * Retrieve all items of a to_stock transaction
     *
     * @param $id
     * @return array
     */
    public function to_stock_items($id) {
        $items_b = DB::select("select I.name, T.quantity, C.name as category, T.unit_price as unit_val
            from (transaction_bulk as T 
                join items as I on T.item_id = I.id
                join categories as C on I.category_id = C.id)
            where T.transaction_id = ?",
            [ $id ] );

        $items_i = DB::select("select * from
            (select R.item_id, I.name, count(*) as quantity, C.name as category
                from (transaction_inventory as T 
                    join inventory_items as R on T.inventory_item_id = R.id
                    join items as I on R.item_id = I.id
                    join categories as C on I.category_id = C.id)
                where T.transaction_id = ? group by R.item_id) as A 
            natural join
            (select distinct R.item_id, R.price as unit_val
                from (transaction_inventory as T
                    join inventory_items as R on T.inventory_item_id = R.id)
                where T.transaction_id = ?) as B",
            [ $id, $id ] );

        return array_merge($items_b, $items_i);
    }


    /**
     * Search for transactions
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Support\Collection
     */
    public function search(Request $request) {
        if($request->phase == '') {
            return redirect()->action('TransactionController@all', ['stn' => $request->stn]);
        }
        else {
            $transactions = DB::table('trans_info')
                ->where(function ($query) use ($request) {
                    $query->where('id', 'like', '%'.$request->phase.'%')
                        ->orWhere('isu_stn', 'like', '%'.$request->phase.'%')
                        ->orWhere('rcv_stn', 'like', '%'.$request->phase.'%')
                        ->orWhere('sup', 'like', '%'.$request->phase.'%')
                        ->orWhere('isu_date', 'like', '%'.$request->phase.'%');
                })
                ->where(function ($query) use ($request) {
                    $query->where('isu_stn_id', $request->stn)
                        ->orWhere('rcv_stn_id', $request->stn);
                })
                ->get();

            return $transactions;
        }
    }

}
