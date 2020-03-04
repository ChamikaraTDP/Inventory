<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MonthlyRecord extends Model
{

    //MonthlyRecord : Station -> M : 1
    public function station(){
        return $this->belongsTo('App\Station');
    }

    //MonthlyRecord : Item -> M : 1
    public function item(){
        return $this->belongsTo('App\Item');
    }
}
