<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\Utils;
use Illuminate\Http\Request;
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


}
