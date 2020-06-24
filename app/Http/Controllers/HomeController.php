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
        $this->middleware('can:edit_settings')->only(['tests', 'get_all']);
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function tests()
    {
        return view('home');
    }

    // TODO: user_type should not be revealed
    public function index()
    {
        $categories = Category::select('id', 'name')->get();
        $items = Item::select('id', 'name', 'type', 'category_id')->get();
        $stations = Station::select('id', 'name')->get();
        $users = User::select('id', 'name', 'station_id')
            ->where('user_type', '<>', 'guest')
            ->get();

        return view('layouts.top_navigation', compact('categories', 'items', 'stations', 'users'));
    }

    public function get_all() {
        $categories = Category::select('id', 'name')->get();
        $items = Item::select('id', 'name', 'type', 'category_id')->get();
        $stations = Station::select('id', 'name')->get();
        $users = User::select('id', 'name', 'user_type', 'station_id')
            ->with('station:id,name')
            ->where('user_type', '<>', 'guest')
            ->get();

        return compact('categories', 'items', 'stations', 'users');
    }
}
