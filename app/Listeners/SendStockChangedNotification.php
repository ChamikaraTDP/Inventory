<?php

namespace App\Listeners;

use App\Events\StockChanged;
use App\Item;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;

class SendStockChangedNotification implements ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  StockChanged  $event
     * @return void
     */
    public function handle(StockChanged $event)
    {
       /* sleep(10);
        $data = $event->item;

        DB::table('items')->insert([
            'name' => $data->name,
            'category_id' => $data->category,
            'type' => $data->type
        ]);*/

        /*$item = new Item;
        $item->name = $data->name;
        $item->category_id = $data->category;
        $item->type = $data->type;

        $item->save();*/
    }
}
