<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    //Category :-Item -> 1 : M
    public function items(){
        return $this->hasMany('App\Item');
    }
}
