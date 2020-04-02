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
        function get_items() {
            var items = @json($items);
            return items;
        }

        function get_categories() {
            var categories = @json($categories);
            return categories;
        }

        function get_stations() {
            var stations = @json($stations);
            return stations;
        }

        function get_users() {
            var users = @json($users);
            return users;
        }

        function get_user() {
            var user = @json(auth()->user());
            return user;
        }

        function getCSRF() {
             return '{{csrf_token()}}';
        }
    </script>

    <script src="{{ asset('js/inventory.js') }}"></script>
@endsection
