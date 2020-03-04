@extends('layouts.app')

@section('content')
    <!-- navigation bar -->
    <div class="nv-box">
        <button onclick="tab_selection(0);">Add</button>
        <button onclick="tab_selection(1);">Issue</button>
        <button onclick="tab_selection(2);">View</button>
        <button onclick="tab_selection(3);">Reports</button>
    </div>

    {{--<div class="grid-container">
        <div class="grid-box">
        </div>
    </div>--}}
    @yield('forms')
@endsection
