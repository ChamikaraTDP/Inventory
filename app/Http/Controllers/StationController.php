<?php

namespace App\Http\Controllers;

use App\Station;
use Illuminate\Http\Request;

class StationController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
        $this->middleware('can:edit_settings');
    }

    public function index() {
        $stations = Station::all();

        return $stations;
    }
}
