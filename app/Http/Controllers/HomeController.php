<?php

namespace App\Http\Controllers;

use App\Category;
use App\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use mysql_xdevapi\Table;

class HomeController extends Controller
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
        //$user = auth()->user()->id;

        /*$avail_items = DB::table('users')
                           ->join('transactions', 'users.station_id', '=', 'transactions.receiving_station')
                           ->join('transaction_bulk', 'transactions.id', '=', 'transaction_bulk.transaction_id')
                           ->select('item_id', DB::raw('sum(quantity) as quantity') )
                           ->where('users.id', $user)
                           ->groupBy('item_id')
                           ->get();*/

        //$test = DB::table('users')->pluck('name');

        //$roles = DB::table('users')->pluck('name', 'id');

        /*foreach ($roles as $id => $name) {
            echo $name . ' ' . $id;
        }*/

        //dd($test);
        //dd($avail_items);
        return view('home');
    }

    public function nav_index()
    {
        $categories = Category::select('id', 'name')->get();
        $items = Item::select('id', 'name', 'category_id')->get();

        return view('layouts.top_navigation', compact('categories', 'items'));
    }


}
