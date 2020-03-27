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
    <script>
        var items = @json($items);
        var categories = @json($categories);

        function getCSRF() {
             return '{{csrf_token()}}';
        }
    </script>

    <script src="{{ asset('js/inventory.js') }}"></script>
@endsection
