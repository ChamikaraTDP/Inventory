<?php

namespace App\Http\Controllers;

use App\Jobs\DeleteInvItem;
use App\Jobs\UpdateInvItem;
use Illuminate\Http\Request;

class InventoryItemController extends Controller
{

    public function update(Request $request){
        UpdateInvItem::dispatch($request->id, $request->status);
    }

    public function delete(Request $request) {
        DeleteInvItem::dispatch($request->id);
    }
}
