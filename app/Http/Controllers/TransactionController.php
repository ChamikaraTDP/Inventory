<?php

namespace App\Http\Controllers;

use App\InventoryItem;
use App\Item;
use App\Transaction;
use Illuminate\Http\Request;
use App\Category;
use Illuminate\Support\Facades\DB;
use Throwable;

class TransactionController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth');
    }


    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index() {
        $categories = Category::select('id', 'name')->get();
        $items = Item::select('id', 'name', 'category_id')->get();

        return view('add_items', compact('categories', 'items'));
    }


    /**
     * handle add form data
     *
     * @param Request $request add item details
     * @return void
     */
    public function add_items(Request $request) {
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

        return response( " transaction recorded successfully", 200);
    }


    /**
     * handle queries and filtering of data
     * @param $station
     * @return array
     */
    private function get_bulk_items($station){

        $rcv_items = DB::table('transactions')
            ->join('transaction_bulk', 'transactions.id', '=', 'transaction_bulk.transaction_id')
            ->join('items', 'transaction_bulk.item_id', '=', 'items.id')
            ->select('item_id', DB::raw('sum(quantity) as quantity'), 'name', 'category_id', 'type' )
            ->where('transactions.receiving_station', $station)
            ->groupBy('item_id')
            ->get();

        $isu_items = DB::table('transactions')
            ->join('transaction_bulk', 'transactions.id', '=', 'transaction_bulk.transaction_id')
            ->join('items', 'transaction_bulk.item_id', '=', 'items.id')
            ->select('item_id', DB::raw('sum(quantity) as quantity'), 'name', 'category_id', 'type' )
            ->where('transactions.issuing_station', $station)
            ->groupBy('item_id')
            ->get();

        $avl_items = [];

        foreach ($rcv_items as $rcv_item) {
            $isu_itm =  $isu_items->firstWhere('item_id', $rcv_item->item_id);

            if($isu_itm) {
                $rcv_item->quantity = $rcv_item->quantity - $isu_itm->quantity;
            }
            if($rcv_item->quantity > 0) {
                array_push($avl_items, $rcv_item);
            }
            else if($rcv_item->quantity < 0) {

                return $rcv_item->item_id;
                break;
            }
        }

        return $avl_items;
    }

    public function get_inv_items($station){

        $inv_items = DB::table('inventory_items')
            ->join('items', 'inventory_items.item_id', '=', 'items.id')
            ->select('item_id', DB::raw('count(item_id) as quantity'), 'name', 'category_id', 'type')
            ->where('current_station', $station)
            ->groupBy('item_id')
            ->get();

        return $inv_items;

    }


    /**
     * response with station & user data
     */
    public function load_issue_tab() {
        $station = auth()->user()->station_id;

        $bulk_items = $this->get_bulk_items($station);
        $inv_items = $this->get_inv_items($station);

        $avl_items = array_merge($bulk_items, $inv_items->toArray());

        if(is_array($avl_items)) {
            try {
                $issue_view = view('issue_tab')->render();

                return response()->json(array("issue_view" => $issue_view, "items" => $avl_items));

            } catch (Throwable $e) {

                return response(' error occurred during view rendering ', 500);
            }
        }
        else {
            return response(' error occurred when loading the items ', 500);
        }
    }


    /**
     * handle queries for saving issue request &
     *   send back updated item data
     *
     * @param Request $request issue details
     * @return Response
     */
    public function issue_items(Request $request) {
        $issue = json_decode($request->input('issue'));

        $itm_bulk = $issue->items->bulk;
        $itm_inv = $issue->items->inv;
        $details = $issue->details;
        $user = auth()->user();

        $transaction = new Transaction;
        $transaction->issuing_date = $details->isu_date;
        $transaction->received_by = $details->rcv_usr;
        $transaction->receiving_station = $details->rcv_stn;
        $transaction->issued_by = $user->id;
        $transaction->issuing_station = $user->station_id;
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
                        ['current_station', '=', $user->station_id],
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


        $bulk_items = $this->get_bulk_items($user->station_id);
        $inv_items = $this->get_inv_items($user->station_id);

        $avl_items = array_merge($bulk_items, $inv_items->toArray());

        if(is_array($avl_items)) {

            return response()->json(array("items" => $avl_items,
                "msg" => "transaction created for issue and items attached successfully"));
        }
        else {
            return response('item ' . $avl_items . ' has a negative quantity!', 500);
        }
    }

}
