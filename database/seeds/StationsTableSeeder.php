<?php

use App\Station;
use Illuminate\Database\Seeder;

class StationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Station::unguard();
        DB::table('stations')->insert(
            [
                ['id' =>1, 'name' =>'Stock'],
                ['id' =>2, 'name' =>'Accounts division'],
                ['id' =>3, 'name' =>'IT division'],
                ['id' =>4, 'name' =>'Management division'],
                ['id' =>5, 'name' =>'Kalutara district office'],
                ['id' =>6, 'name' =>'Galle district office'],
                ['id' =>7, 'name' =>'Operations division'],
            ]
        );
        Station::reguard();
    }
}
