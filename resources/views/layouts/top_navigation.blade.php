@extends('layouts.app')

@section('content')
    <!-- navigation bar -->
    <div class="nv_box">
        <button onclick="tab_selection(0);">Add</button>
        <button onclick="tab_selection(1);">Issue</button>
        <button onclick="tab_selection(2);">View</button>
        <button onclick="tab_selection(3);">Reports</button>
    </div>

    <div class="grid_area" id="grid_area"></div>

@endsection

@section('js_area')
    @include('js.inventory_main_js_blade')
    <script src="{{ asset('js/inventory_main.js') }}"></script>
@endsection
