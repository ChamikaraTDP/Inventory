<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{

    //InventoryItem : Item -> M : 1
    public function item(){
        return $this->belongsTo('App\Item');
    }

    //Item : Transaction -> M : M
    public function transactions(){
        return $this->belongsToMany('App\Transaction', 'transaction_inventory')
            ->withTimestamps();
    }
}
