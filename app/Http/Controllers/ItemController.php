<?php

namespace App\Http\Controllers;

use App\Category;
use App\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index(){
        $categories = Category::select('id', 'name')->get();

        return view('/new_item', compact('categories'));
    }

    public function create(Request $request){
        $item = new Item;

        $item->name = $request->name;
        $item->category_id = $request->category;
        $item->type = $request->type;

        $item->save();

    }
}