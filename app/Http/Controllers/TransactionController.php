<?php

namespace App\Http\Controllers;

use App\Item;
use App\Transaction;
use Illuminate\Http\Request;
use App\Category;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $categories = Category::select('id', 'name')->get();
        $items = Item::select('id', 'name', 'category_id')->get();

        return view('add_items', compact('categories', 'items'));
    }

    public function send_data(Request $request)
    {
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

        /*$str = "<div>";
        foreach($itms[0] as $x => $x_value) {
            echo "Key=" . $x . ", Value=" . $x_value;
            echo "<br>";
        }
        $str += "</div>";*/
        //$len = $itms->le



        echo "transaction created and items attached successfully";

       /* try {





        } catch (Exception $ex) {
            return response()->json(
                [ 'message' => 'cannot attach items!' ], 500
            );
        }*/

        //echo "recorded!";
    }

}
