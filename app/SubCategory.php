<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class subCategory extends Model
{
    //SubCategory : Item -> 1 : M
    public function items(){
        return $this->hasMany('App\Item');
    }

}
