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
                ['id' =>1, 'name' =>'A4 color', 'type' =>0, 'category_id' =>3],
                ['id' =>2, 'name' =>'half sheet', 'type' =>0,'category_id' =>3],
                ['id' =>3, 'name' =>'computer sheet', 'type' =>0,'category_id' =>3],
                ['id' =>4, 'name' =>'field books', 'type' =>0,'category_id' =>3],
                ['id' =>5, 'name' =>'pencil', 'type' =>0,'category_id' =>3],
                ['id' =>6, 'name' =>'eraser', 'type' =>0,'category_id' =>3],
                ['id' =>7, 'name' =>'gum tube', 'type' =>0,'category_id' =>3],
                ['id' =>8, 'name' =>'ink pad', 'type' =>0,'category_id' =>3],
                ['id' =>9, 'name' =>'white board marker', 'type' =>0,'category_id' =>3],
                ['id' =>10, 'name' =>'permanent marker', 'type' =>0,'category_id' =>3],
                ['id' =>11, 'name' =>'highlighter', 'type' =>0,'category_id' =>3],
                ['id' =>12, 'name' =>'box file', 'type' =>0,'category_id' =>3],
                ['id' =>13, 'name' =>'puncher', 'type' =>0,'category_id' =>3],
                ['id' =>14, 'name' =>'heater', 'type' =>1,'category_id' =>2],
                ['id' =>15, 'name' =>'hot plate', 'type' =>1,'category_id' =>2],
                ['id' =>16, 'name' =>'desktop computer', 'type' =>1,'category_id' =>1],
                ['id' =>17, 'name' =>'laptop computer', 'type' =>1,'category_id' =>1],
                ['id' =>18, 'name' =>'computer monitor', 'type' =>1,'category_id' =>1],
                ['id' =>19, 'name' =>'wind screen', 'type' =>1,'category_id' =>4],
                ['id' =>20, 'name' =>'tires', 'type' =>0,'category_id' =>4],
                ['id' =>21, 'name' =>'head lights', 'type' =>1,'category_id' =>4],
                ['id' =>22, 'name' =>'cement', 'type' =>0,'category_id' =>5],
                ['id' =>23, 'name' =>'metal doors', 'type' =>1,'category_id' =>5],
                ['id' =>24, 'name' =>'glass doors', 'type' =>1,'category_id' =>5],
                ['id' =>25, 'name' =>'round wood table', 'type' =>1,'category_id' =>6],
                ['id' =>26, 'name' =>'computer table','type' =>1, 'category_id' =>6],
                ['id' =>27, 'name' =>'computer chairs', 'type' =>0,'category_id' =>6],
            ]
        );
        Item::reguard();
    }
}
