<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\Utils;
use App\InventoryItem;
use App\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        return response( " transaction recorded successfully", 200);
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

        $avl_items = $this->get_items($user->station_id);

        if(is_array($avl_items)) {

            return response()->json(array("items" => $avl_items,
                "msg" => "transaction created for issue and items attached successfully"));
        }
        else {
            return response('item ' . $avl_items . ' has a negative quantity!', 500);
        }
    }

}
