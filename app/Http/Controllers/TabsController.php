<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\Utils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class TabsController extends Controller
{
    use Utils;

    /**
     * render the issue tab
     * response with station & user data
     *
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function stk_issue() {

        $avl_items = $this->get_items(1);

        if(is_array($avl_items)) {
            try {
                $issue_view = view('/tabs/issue')->render();
                return response()->json(array("issue_view" => $issue_view, "items" => $avl_items));
            }
            catch (Throwable $e) {
                return response(' error occurred during view rendering ', 500);
            }
        }
        else {
            return response(' error occurred when loading the items ', 500);
        }
    }


    /**
     * render the issue tab
     * response with station & user data
     *
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function stn_issue(Request $request) {
        $station = $request->stn;

        $avl_items = $this->get_items_with_codes($station);

        if(is_array($avl_items)) {
            try {
                $issue_view = view('/tabs/issue')->render();
                return response()->json(array("issue_view" => $issue_view, "items" => $avl_items));
            }
            catch (Throwable $e) {
                return response(' error occurred during view rendering ', 500);
            }
        }
        else {
            return response(' error occurred when loading the items ', 500);
        }
    }


    /**
     * render the  view tab
     *
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function view(Request $request) {
        $station = $request->stn;

        $trans = DB::select('select * from trans_info where isu_stn_id = ? or rcv_stn_id = ? order by id desc',
            [$station, $station]);

        try {
            $view_tab = view('/tabs/view')->render();
            return response()->json(array("view_tab" => $view_tab, "trans" => $trans));
        }
        catch (Throwable $e) {
            return response(' error occurred during view rendering ', 500);
        }
    }


    /**
     * render the reports tab
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function reports() {
        return view('tabs/reports');
    }


}
