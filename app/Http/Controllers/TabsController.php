<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\Utils;
use Illuminate\Support\Facades\DB;
use Throwable;

class TabsController extends Controller
{
    use Utils;
    /**
     * response with station & user data
     */
    public function issue() {
        $station = auth()->user()->station_id;

        $avl_items = $this->get_items($station);

        if(is_array($avl_items)) {
            try {
                $issue_view = view('/tabs/issue')->render();

                return response()->json(array("issue_view" => $issue_view, "items" => $avl_items));

            } catch (Throwable $e) {

                return response(' error occurred during view rendering ', 500);
            }
        }
        else {
            return response(' error occurred when loading the items ', 500);
        }
    }

    public function view() {

        $station = auth()->user()->station_id;

        $trans = DB::select('select * from trans_info where isu_stn_id = ? or rcv_stn_id = ? order by id desc',
            [$station, $station]);

        try {
            $view_tab = view('/tabs/view')->render();

            return response()->json(array("view_tab" => $view_tab, "trans" => $trans));

        } catch (Throwable $e) {

            return response(' error occurred during view rendering ', 500);

        }

    }


}
