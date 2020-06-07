<?php

namespace App\Http\Controllers\Traits;

use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use stdClass;

trait Utils {

    /**
     * get all available bulk item quantities of a station
     *
     * @param $station
     * @return Collection
     * @throws Exception
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

        $avl_items = collect([]);

        foreach ($rcv_items as $rcv_item) {
            $isu_itm =  $isu_items->firstWhere('item_id', $rcv_item->item_id);

            if($isu_itm) {
                $rcv_item->quantity = $rcv_item->quantity - $isu_itm->quantity;
            }
            if($rcv_item->quantity > 0) {
                $avl_items->push($rcv_item);
            }
            else if($rcv_item->quantity < 0) {
                throw new Exception('Item '.$rcv_item->item_id.' has a negative quantity!');
            }
        }

        return $avl_items;
    }


    /**
     * get all available inventory item quantities of a station
     *
     * @param $station
     * @return \Illuminate\Support\Collection
     */
    public function get_inv_items($station){

        $inv_items = DB::table('inventory_items')
            ->join('items', 'inventory_items.item_id', '=', 'items.id')
            ->select('item_id', DB::raw('count(item_id) as quantity'), 'name', 'category_id', 'type')
            ->where('current_station', $station)
            ->groupBy('item_id')
            ->get();

        return $inv_items;

    }


    /**
     * get all available inventory item quantities of a station
     *
     * @param $station
     * @return array
     */
    public function get_items_with_codes($station) {

        $inv_items = DB::table('inventory_items')
            ->join('items', 'inventory_items.item_id', '=', 'items.id')
            ->select('inventory_items.id', 'item_id', 'name', 'item_code', 'serial_no', 'category_id')
            ->where('current_station', $station)
            ->orderBy('item_id')
            ->get();

        return $this->process_instance_info($inv_items);

    }


    /**
     * get all available item quantities of a statiion
     *
     * @param $station
     * @return Collection
     * @throws Exception
     */
    public function get_items($station){
        $bulk_items = $this->get_bulk_items($station);
        $inv_items = $this->get_inv_items($station);

        $avl_items = $bulk_items->merge($inv_items);

        return $avl_items;
    }


    /**
     * retrieve all received/issued item quantities
     *
     * @param $qd
     * @return \Illuminate\Support\Collection
     */
    public function get_all_bulk($qd) {
        $is_rcv = $qd->tran_type == 'rcv';
        $full_range = $qd->start_date && $qd->end_date;

        $items = DB::table('transactions')
            ->join('transaction_bulk', 'transactions.id', '=', 'transaction_bulk.transaction_id')
            ->join('items', 'transaction_bulk.item_id', '=', 'items.id')
            ->select('items.name', DB::raw('sum(quantity) as quantity'))
            ->when($is_rcv, function ($query) use ($qd) {
                return $query->where('transactions.receiving_station', $qd->u_stn);
            }, function ($query) use ($qd) {
                return $query->where('transactions.issuing_station', $qd->u_stn);
            })
            ->when($full_range, function ($query) use ($qd) {
                return $query->whereBetween('issuing_date', [$qd->start_date, $qd->end_date]);
            }, function ($query) use ($qd) {
                return $query->when($qd->start_date, function ($query) use ($qd){
                    return $query->where('issuing_date', '>=', $qd->start_date);
                })
                ->when($qd->end_date, function ($query) use ($qd) {
                    return $query->where('issuing_date', '<=', $qd->end_date);
                });
            })
            ->groupBy('item_id')
            ->get();

        return $items;
    }


    /**
     * retrieve all received/issued item details
     *
     * @param $qd
     * @return array
     */
    public function get_all_inv($qd) {
        $is_rcv = $qd->tran_type == 'rcv';
        $full_range = $qd->start_date && $qd->end_date;

        $item_info = DB::table("transactions")
            ->join("transaction_inventory",
                "transactions.id" , "=", "transaction_inventory.transaction_id")
            ->join("inventory_items",
                "transaction_inventory.inventory_item_id", "=", "inventory_items.id")
            ->join("items", "inventory_items.item_id", "=", "items.id")
            ->select('item_id', 'items.name', 'item_code', 'serial_no')
            ->when($is_rcv, function ($query) use ($qd) {
                return $query->where('transactions.receiving_station', $qd->u_stn);
            }, function ($query) use ($qd) {
                return $query->where('transactions.issuing_station', $qd->u_stn);
            })
            ->when($full_range, function ($query) use ($qd) {
                return $query->whereBetween('issuing_date', [$qd->start_date, $qd->end_date]);
            }, function ($query) use ($qd) {
                return $query->when($qd->start_date, function ($query) use ($qd){
                    return $query->where('issuing_date', '>=', $qd->start_date);
                })
                    ->when($qd->end_date, function ($query) use ($qd) {
                        return $query->where('issuing_date', '<=', $qd->end_date);
                    });
            })
            ->orderBy("item_id")
            ->get();

        return $this->process_inv_info($item_info);

    }


    /**
     * retrieve all received/issued inventory item counts
     *
     * @param $qd
     * @return \Illuminate\Support\Collection
     */
    public function get_all_inv_count($qd) {
        $is_rcv = $qd->tran_type == 'rcv';
        $full_range = $qd->start_date && $qd->end_date;

        $item_info = DB::table("transactions")
            ->join("transaction_inventory",
                "transactions.id" , "=", "transaction_inventory.transaction_id")
            ->join("inventory_items",
                "transaction_inventory.inventory_item_id", "=", "inventory_items.id")
            ->join("items", "inventory_items.item_id", "=", "items.id")
            ->select('name', DB::raw('count(*) as quantity'))
            ->when($is_rcv, function ($query) use ($qd) {
                return $query->where('transactions.receiving_station', $qd->u_stn);
            }, function ($query) use ($qd) {
                return $query->where('transactions.issuing_station', $qd->u_stn);
            })
            ->when($full_range, function ($query) use ($qd) {
                return $query->whereBetween('issuing_date', [$qd->start_date, $qd->end_date]);
            }, function ($query) use ($qd) {
                return $query->when($qd->start_date, function ($query) use ($qd){
                    return $query->where('issuing_date', '>=', $qd->start_date);
                })
                    ->when($qd->end_date, function ($query) use ($qd) {
                        return $query->where('issuing_date', '<=', $qd->end_date);
                    });
            })
            ->groupBy("item_id")
            ->get();

        return $item_info;

    }


    /**
     * organize inventory items data
     *
     * @param $itm_info [{item_id, name, item_code, serial_no }, ...]
     * @return array
     */
    public function process_inv_info($itm_info) {
        $items = [];

        if(count($itm_info) <= 0) {
            return $items;
        }

        $item = new stdClass();
        $item->name = $itm_info[0]->name;
        $item->id = $itm_info[0]->item_id;
        $item->codes = [];

        $item_id = $itm_info[0]->item_id;
        $qun = 0;

        foreach ($itm_info as $record) {

            if ($record->item_id == $item_id) {
                $itm_code = new stdClass();
                $itm_code->code = $record->item_code;
                $itm_code->serial = $record->serial_no;

                $qun++;

                array_push($item->codes, $itm_code);
            }
            else {
                $item->quantity = $qun;
                array_push($items, $item);

                $qun = 1;

                $item = new stdClass();
                $item->name = $record->name;
                $item->id = $record->item_id;
                $item->codes = [];

                $itm_code = new stdClass();
                $itm_code->code = $record->item_code;
                $itm_code->serial = $record->serial_no;

                array_push($item->codes, $itm_code);

                $item_id = $record->item_id;
            }
        }

        $item->quantity = $qun;
        array_push($items, $item);

        return $items;
    }

    /**
     * organize inventory items data
     *
     * @param $itm_info [{item_id, name, item_code, serial_no }, ...]
     * @return array
     */
    public function process_instance_info($itm_info) {
        $items = [];

        if(count($itm_info) <= 0) {
            return $items;
        }

        $item = new stdClass();
        $item->item_id = $itm_info[0]->item_id;
        $item->name = $itm_info[0]->name;
        $item->category_id = $itm_info[0]->category_id;
        $item->codes = [];

        $item_id = $itm_info[0]->item_id;
        $qun = 0;

        foreach ($itm_info as $record) {

            if ($record->item_id == $item_id) {
                $itm_code = new stdClass();
                $itm_code->id = $record->id;
                $itm_code->code = $record->item_code;
                $itm_code->serial = $record->serial_no;

                $qun++;

                array_push($item->codes, $itm_code);

            }
            else {
                $item->quantity = $qun;
                array_push($items, $item);

                $qun = 1;

                $item = new stdClass();
                $item->item_id = $record->item_id;
                $item->name = $record->name;
                $item->category_id = $record->category_id;
                $item->codes = [];

                $itm_code = new stdClass();
                $itm_code->id = $record->id;
                $itm_code->code = $record->item_code;
                $itm_code->serial = $record->serial_no;

                array_push($item->codes, $itm_code);

                $item_id = $record->item_id;
            }
        }

        $item->quantity = $qun;
        array_push($items, $item);

        return $items;
    }

}
