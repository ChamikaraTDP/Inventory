<?php

namespace App\Http\Controllers;

use App\Category;
use App\Events\StockChanged;
use App\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth');
        $this->middleware('can:create, App\Item');
    }


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
        //event(new StockChanged($item));
    }

    public function store(Request $request){
        $item = new Item;

        $item->name = $request->name;
        $item->category_id = $request->category_id;
        $item->type = $request->type;

        $item->save();
    }

    public function update(Request $request, Item $item){
        //$item = Item::find($request->id);
        $item->name = $request->name;
        $item->category_id = $request->category_id;
        $item->type = $request->type;
        $item->save();
    }

    public function destroy(Item $item)
    {
        try {
            $item->delete();
        }
        catch (\Exception $exp) {
            return response($exp->getMessage(), 500);
        }
    }
}
