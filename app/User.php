<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'username', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];*/

    //User : Station -> M : 1
    public function station(){
        return $this->belongsTo('App\Station');
    }

    //user issued many transactions
    public function issued_transactions(){
        return $this->hasMany('App\Transaction', 'issued_by');
    }

    //user received many transactions
    public function received_transactions(){
        return $this->hasMany('App\Transaction', 'received_by');
    }
}
