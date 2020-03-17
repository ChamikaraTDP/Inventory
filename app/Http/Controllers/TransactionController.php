<?php

namespace App\Http\Controllers;

use App\Item;
use App\Station;
use App\Transaction;
use App\User;
use Illuminate\Http\Request;
use App\Category;
use Illuminate\Support\Facades\Auth;
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
        $itm_arr = $data->item_details;

        $transaction = new Transaction;

        $transaction->issuing_date = $form_data->date;
        $transaction->receipt_no = $form_data->issue_no;
        $transaction->received_by = Auth::user()->id;
        $transaction->receiving_station = Auth::user()->station_id;
        $transaction->transaction_type = "to_stock";
        $transaction->supplier = $form_data->supplier;
        $transaction->description = $form_data->description;
        $transaction->save();

        $attach_arr = [];

        $item_count = count($itm_arr);
        for($i = 0; $i < $item_count; $i++){
            $attach_arr[$itm_arr[$i]->item_id] = array('quantity' => $itm_arr[$i]->quantity, 'unit_price' => $itm_arr[$i]->unit_price);
        }

        $transaction->bulk_items()->attach($attach_arr);

        echo "transaction created for add and items attached successfully";

    }


    /**
     * handle queries and filtering of data
     * @return array
     */
    private function get_avail_items(){
        $user = auth()->user()->id;

        $rcv_items = DB::table('users')
            ->join('transactions', 'users.station_id', '=', 'transactions.receiving_station')
            ->join('transaction_bulk', 'transactions.id', '=', 'transaction_bulk.transaction_id')
            ->select('item_id', DB::raw('sum(quantity) as quantity') )
            ->where('users.id', $user)
            ->groupBy('item_id')
            ->get();

        $isu_items = DB::table('users')
            ->join('transactions', 'users.station_id', '=', 'transactions.issuing_station')
            ->join('transaction_bulk', 'transactions.id', '=', 'transaction_bulk.transaction_id')
            ->select('item_id', DB::raw('sum(quantity) as quantity') )
            ->where('users.id', $user)
            ->groupBy('item_id')
            ->get();

        $avl_items = [];
        foreach ($rcv_items as $rcv_item) {
            $isu_itm =  $isu_items->firstWhere('item_id', $rcv_item->item_id);

            if($isu_itm) {
                $rcv_item->quantity = $rcv_item->quantity - $isu_itm->quantity;
            }
            if($rcv_item->quantity > 0){
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

            $stations = Station::select('id', 'name')->where('id', '!=', auth()->user()->station_id)->get();

            $users = User::select('id', 'name', 'station_id')->get();

            /*$rcv_items = DB::select('select item_id, sum(quantity) as quantity
                            from users, transactions, transaction_bulk
                            where users.id = :user
                            and users.station_id = transactions.receiving_station
                            and transactions.id = transaction_bulk.transaction_id group by item_id', ['user' => $user]);*/

            try {
                $issue_view = view('issue_tab')->render();
                return response()->json(array("issue_view" => $issue_view, "items" => $avl_items,
                    "stations" => $stations, "users" => $users));
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
        //echo $request;
        $issue = json_decode($request->input('issue'));

        $items = $issue->items;
        $details = $issue->details;

        $transaction = new Transaction;

        $transaction->issuing_date = $details->isu_date;
        $transaction->receipt_no = $details->rcp_no;
        $transaction->received_by = $details->rcv_usr;
        $transaction->receiving_station = $details->rcv_stn;
        $transaction->issue_no = $details->isu_no;
        $transaction->issued_by = auth()->user()->id;
        $transaction->issuing_station = auth()->user()->station_id;
        $transaction->transaction_type = "stn_to_stn";

        $transaction->save();

        $attach_arr = [];

        $item_count = count($items);
        for($i = 0; $i < $item_count; $i++){
            $attach_arr[$items[$i]->item_id] = array('quantity' => $items[$i]->quantity);
        }

        $transaction->bulk_items()->attach($attach_arr);

        $avl_items = $this->get_avail_items();

        if(is_array($avl_items)) {
            return response()->json(array("items" => $avl_items,
                "msg" => "transaction created for issue and items attached successfully"));
        }
        else {
            return response('item ' . $avl_items . ' has a negative quantity!', 500);
        }
    }

}
