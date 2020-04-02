<?php

namespace App\Http\Controllers;

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
        $attach_arr = [];
        $itm_count = 0;
        $last_id = [];
        $first_id = 0;
        $itm_ids = [];
        $transaction = new Transaction;

        $transaction->issuing_date = $form_data->date;
        $transaction->receipt_no = $form_data->issue_no;
        $transaction->received_by = $user->id;
        $transaction->receiving_station = $user->station_id;
        $transaction->transaction_type = "to_stock";
        $transaction->supplier = $form_data->supplier;
        $transaction->description = $form_data->description;
        $transaction->save();

        for($i = 0; $i < $bulk_count; $i++){
            $attach_arr[$itm_bulk[$i]->item_id] = array('quantity' => $itm_bulk[$i]->quantity,
                'unit_price' => $itm_bulk[$i]->unit_price);
        }

        $transaction->bulk_items()->attach($attach_arr);

        $attach_arr = [];

        for($i = 0; $i < $inv_count; $i++){
            $quan = $itm_inv[$i]->quantity;
            $itm_count += $quan;
            for($j = 0; $j < $quan; $j++){
                array_push($attach_arr,['item_id' => $itm_inv[$i]->item_id,
                    'price' => $itm_inv[$i]->unit_price]);
            }
        }

        DB::table('inventory_items')->insert($attach_arr);

        $last_id = DB::select('select LAST_INSERT_ID() as id');
        $first_id = $last_id[0]->id;

        for($k = 0; $k < $itm_count; $k++){
            array_push($itm_ids, ($first_id + $k) );
        }

        $transaction->inventory_items()->attach($itm_ids);

        return response( " transaction recorded successfully", 200);
    }


    /**
     * handle queries and filtering of data
     * @return array
     */
    private function get_avail_items(){
        $station = auth()->user()->station_id;
        $avl_items = [];

        $rcv_items = DB::table('transactions')
            ->join('transaction_bulk', 'transactions.id', '=', 'transaction_bulk.transaction_id')
            ->join('items', 'transaction_bulk.item_id', '=', 'items.id')
            ->select('item_id', DB::raw('sum(quantity) as quantity'), 'name', 'category_id' )
            ->where('transactions.receiving_station', $station)
            ->groupBy('item_id')
            ->get();

        $isu_items = DB::table('transactions')
            ->join('transaction_bulk', 'transactions.id', '=', 'transaction_bulk.transaction_id')
            ->join('items', 'transaction_bulk.item_id', '=', 'items.id')
            ->select('item_id', DB::raw('sum(quantity) as quantity'), 'name', 'category_id' )
            ->where('transactions.issuing_station', $station)
            ->groupBy('item_id')
            ->get();

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


    /**
     * response with station & user data
     *
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function load_issue_tab() {
        $avl_items = $this->get_avail_items();

        if(is_array($avl_items)) {
            try {
                $issue_view = view('issue_tab')->render();

                return response()->json(array("issue_view" => $issue_view, "items" => $avl_items));

            } catch (Throwable $e) {

                return response('error occurred during view rendering', 500);
            }
        }
        else {
            return response('item ' . $avl_items . ' has a negative quantity!', 500);
        }
    }


    /**
     * handle queries for saving issue request &
     *   send back updated item data
     *
     * @param Request $request issue details
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function issue_items(Request $request) {
        $issue = json_decode($request->input('issue'));

        $items = $issue->items;
        $details = $issue->details;
        $attach_arr = [];
        $item_count = count($items);
        $avl_items = $this->get_avail_items();

        $transaction = new Transaction;
        $transaction->issuing_date = $details->isu_date;
        $transaction->received_by = $details->rcv_usr;
        $transaction->receiving_station = $details->rcv_stn;
        $transaction->issued_by = auth()->user()->id;
        $transaction->issuing_station = auth()->user()->station_id;
        $transaction->transaction_type = "stn_to_stn";
        $transaction->save();

        for($i = 0; $i < $item_count; $i++){
            $attach_arr[$items[$i]->item_id] = array('quantity' => $items[$i]->quantity);
        }

        $transaction->bulk_items()->attach($attach_arr);

        if(is_array($avl_items)) {

            return response()->json(array("items" => $avl_items,
                "msg" => "transaction created for issue and items attached successfully"));
        }
        else {
            return response('item ' . $avl_items . ' has a negative quantity!', 500);
        }
    }

}
