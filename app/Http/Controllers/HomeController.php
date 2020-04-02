<?php

namespace App\Http\Controllers;

use App\Category;
use App\Item;
use App\Station;
use App\User;

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
        return view('home');
    }

    public function nav_index()
    {
        $categories = Category::select('id', 'name')->get();
        $items = Item::select('id', 'name', 'type', 'category_id')->get();
        $stations = Station::select('id', 'name')->get();
        $users = User::select('id', 'name', 'station_id')->get();

        return view('layouts.top_navigation', compact('categories', 'items', 'stations', 'users'));
    }


}
