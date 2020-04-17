<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index(){
        return view('/tabs/new_item');
    }

    public function save(){

    }
}
