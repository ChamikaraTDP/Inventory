<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    //Transaction : Item -> M : M
    public function bulk_items(){
        return $this->belongsToMany('App\Item','transaction_bulk')
            ->withPivot('quantity', 'unit_price')
            ->withTimestamps();
    }

    //Transaction : InventoryItem -> M : M
    public function inventory_items(){
        return $this->belongsToMany('App\InventoryItem','transaction_inventory')
            ->withTimestamps();
    }

    //transaction has one issuing user
    public function issuing_user(){
        return $this->belongsTo('App\User', 'issued_by');
    }

    //transaction has one receiving user
    public function receiving_user(){
        return $this->belongsTo('App\User', 'received_by');
    }

    //transaction has one issuing station
    public function issuing_station(){
        return $this->belongsTo('App\Station', 'issuing_station');
    }

    //transaction has one receiving station
    public function receiving_station(){
        return $this->belongsTo('App\Station', 'receiving_station');
    }

}
