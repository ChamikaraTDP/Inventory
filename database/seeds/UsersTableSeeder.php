<?php

use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = new User;
        $user->name = 'Admin IT';
        $user->username = 'admin';
        $user->user_type = 'admin';
        $user->station_id = 3;
        $user->password = Hash::make('ab56789O');
        $user->save();
    }
}
