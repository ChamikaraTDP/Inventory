<?php

use Illuminate\Database\Seeder;
use App\Item;

class ItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Item::unguard();
        DB::table('items')->insert(
            [
                ['id' =>1, 'name' =>'A4 color', 'type' =>'bulk', 'category_id' =>3],
                ['id' =>2, 'name' =>'half sheet', 'type' =>'bulk','category_id' =>3],
                ['id' =>3, 'name' =>'computer sheet', 'type' =>'bulk','category_id' =>3],
                ['id' =>4, 'name' =>'field books', 'type' =>'bulk','category_id' =>3],
                ['id' =>5, 'name' =>'pencil', 'type' =>'bulk','category_id' =>3],
                ['id' =>6, 'name' =>'eraser', 'type' =>'bulk','category_id' =>3],
                ['id' =>7, 'name' =>'gum tube', 'type' =>'bulk','category_id' =>3],
                ['id' =>8, 'name' =>'ink pad', 'type' =>'bulk','category_id' =>3],
                ['id' =>9, 'name' =>'white board marker', 'type' =>'bulk','category_id' =>3],
                ['id' =>10, 'name' =>'permanent marker', 'type' =>'bulk','category_id' =>3],
                ['id' =>11, 'name' =>'highlighter', 'type' =>'bulk','category_id' =>3],
                ['id' =>12, 'name' =>'box file', 'type' =>'bulk','category_id' =>3],
                ['id' =>13, 'name' =>'puncher', 'type' =>'bulk','category_id' =>3],
                ['id' =>14, 'name' =>'heater', 'type' =>'inventory','category_id' =>2],
                ['id' =>15, 'name' =>'hot plate', 'type' =>'inventory','category_id' =>2],
                ['id' =>16, 'name' =>'desktop computer', 'type' =>'inventory','category_id' =>1],
                ['id' =>17, 'name' =>'laptop computer', 'type' =>'inventory','category_id' =>1],
                ['id' =>18, 'name' =>'computer monitor', 'type' =>'inventory','category_id' =>1],
                ['id' =>19, 'name' =>'wind screen', 'type' =>'inventory','category_id' =>4],
                ['id' =>20, 'name' =>'tires', 'type' =>'bulk','category_id' =>4],
                ['id' =>21, 'name' =>'head lights', 'type' =>'inventory','category_id' =>4],
                ['id' =>22, 'name' =>'cement', 'type' =>'bulk','category_id' =>5],
                ['id' =>23, 'name' =>'metal doors', 'type' =>'inventory','category_id' =>5],
                ['id' =>24, 'name' =>'glass doors', 'type' =>'inventory','category_id' =>5],
                ['id' =>25, 'name' =>'round wood table', 'type' =>'inventory','category_id' =>6],
                ['id' =>26, 'name' =>'computer table','type' =>'inventory', 'category_id' =>6],
                ['id' =>27, 'name' =>'computer chairs', 'type' =>'bulk','category_id' =>6],
            ]
        );
        Item::reguard();
    }
}
