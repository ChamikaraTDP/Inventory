<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Station extends Model
{
    //Station : User -> 1 : M
    public function users(){
        return $this->hasMany('App\User');
    }

    //Station : MonthlyRecord -> 1 : M
    public function monthlyRecords(){
        return $this->hasMany('App\MonthlyRecord');
    }

    //station have issued many transactions
    public function issuing_user(){
        return $this->belongsTo('App\Transaction', 'issuing_station');
    }

    //station have received many transactions
    public function receiving_user(){
        return $this->belongsTo('App\Transaction', 'receiving_station');
    }

}
