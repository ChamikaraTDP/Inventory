<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\Utils;
use Illuminate\Http\Request;
use stdClass;

class ReportsController extends Controller
{
    use Utils;

    /**
     * retrieve data to generate reports regarding the stock
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function stock(Request $request) {
        $items = new stdClass();
        $items->inv = [];
        $items->bulk = [];

        if($request->item_type == 'bulk') {
            $items->bulk = $this->get_all_bulk($request);
        }
        else if($request->item_type == 'inv') {
            if($request->tran_type == 'rcv') {
                $items->bulk = $this->get_all_inv_count($request)->toArray();
            }
            else {
                $items->inv = $this->get_all_inv($request);
            }
        }
        else {
            $items->bulk = $this->get_all_bulk($request)->toArray();

            if($request->tran_type == 'rcv') {
                $items->bulk = array_merge($this->get_all_inv_count($request)->toArray(), $items->bulk);
            }
            else {
                $items->inv = $this->get_all_inv($request);
            }
        }

        return response()->json($items);
    }


    /**
     * retrieve data to generate reports
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generate(Request $request) {
        $items = new stdClass();
        $items->inv = [];
        $items->bulk = [];

        if($request->item_type == 'bulk') {
            $items->bulk = $this->get_all_bulk($request);
        }
        else if($request->item_type == 'inv') {
            $items->inv = $this->get_all_inv($request);
        }
        else {
            $items->bulk = $this->get_all_bulk($request)->toArray();
            $items->inv = $this->get_all_inv($request);
        }

        return response()->json($items);
    }
}
