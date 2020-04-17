<?php

namespace App\Http\Controllers\Traits;

use Illuminate\Support\Facades\DB;

trait Utils {

    /**
     * handle queries and filtering of data
     * @param $station
     * @return array
     */
    public function get_bulk_items($station){

        $rcv_items = DB::table('transactions')
            ->join('transaction_bulk', 'transactions.id', '=', 'transaction_bulk.transaction_id')
            ->join('items', 'transaction_bulk.item_id', '=', 'items.id')
            ->select('item_id', DB::raw('sum(quantity) as quantity'), 'name', 'category_id', 'type' )
            ->where('transactions.receiving_station', $station)
            ->groupBy('item_id')
            ->get();

        $isu_items = DB::table('transactions')
            ->join('transaction_bulk', 'transactions.id', '=', 'transaction_bulk.transaction_id')
            ->join('items', 'transaction_bulk.item_id', '=', 'items.id')
            ->select('item_id', DB::raw('sum(quantity) as quantity'), 'name', 'category_id', 'type' )
            ->where('transactions.issuing_station', $station)
            ->groupBy('item_id')
            ->get();

        $avl_items = [];

        foreach ($rcv_items as $rcv_item) {
            $isu_itm =  $isu_items->firstWhere('item_id', $rcv_item->item_id);

            if($isu_itm) {
                $rcv_item->quantity = $rcv_item->quantity - $isu_itm->quantity;
            }
            if($rcv_item->quantity > 0) {
                array_push($avl_items, $rcv_item);
            }
            else if($rcv_item->quantity < 0) {

                return $rcv_item->item_id;
                break;
            }
        }

        return $avl_items;
    }


    public function get_inv_items($station){

        $inv_items = DB::table('inventory_items')
            ->join('items', 'inventory_items.item_id', '=', 'items.id')
            ->select('item_id', DB::raw('count(item_id) as quantity'), 'name', 'category_id', 'type')
            ->where('current_station', $station)
            ->groupBy('item_id')
            ->get();

        return $inv_items;

    }


    public function get_items($station){
        $bulk_items = $this->get_bulk_items($station);
        $inv_items = $this->get_inv_items($station);

        $avl_items = array_merge($bulk_items, $inv_items->toArray());

        return $avl_items;
    }

}
