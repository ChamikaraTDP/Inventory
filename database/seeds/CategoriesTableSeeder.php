<?php

use Illuminate\Database\Seeder;
use App\Category;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Category::unguard();
        DB::table('categories')->insert(
            [
                ['id' =>1, 'name' =>'IT Accessories'],
                ['id' =>2, 'name' =>'Electronic Items'],
                ['id' =>3, 'name' =>'Stationary'],
                ['id' =>4, 'name' =>'Vehicle & Parts'],
                ['id' =>5, 'name' =>'Building Equipment'],
                ['id' =>6, 'name' =>'Furniture'],
                ['id' =>7, 'name' =>'Other'],
            ]
        );
        Category::reguard();
    }
}
