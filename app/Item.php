<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    //Item : MonthlyRecord -> 1 : M
    public function monthly_records(){
        return $this->hasMany('App\MonthlyRecord');
    }

    //Item : Category -> M : 1
    public function category(){
        return $this->belongsTo('App\Category');
    }

    //Item : SubCategory -> M : 1
    public function sub_category(){
        return $this->belongsTo('App\SubCategory');
    }

    //Item : Transaction -> M : M
    public function transactions(){
        return $this->belongsToMany('App\Transaction', 'transaction_bulk')
            ->withPivot('quantity', 'unit_price')
            ->withTimestamps();
    }

    //Item : InventoryItem -> 1 : M
    public function inventory_items(){
        return $this->hasMany('App\InventoryItem');
    }

}
