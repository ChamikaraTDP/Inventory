@extends('layouts.app')

@section('content')
    <!-- navigation bar -->
    <div class="tabs is-centered is-boxed">
        <ul>
            <li class="is-active">
                <a onclick="tab_selection(0)">
                    <span class="icon is-small"><i class="fas fa-warehouse" aria-hidden="true"></i></span>
                    <span>Add</span>
                </a>
            </li>
            <li>
                <a onclick="tab_selection(1);">
                    <span class="icon is-small"><i class="fas fa-file-signature" aria-hidden="true"></i></span>
                    <span>Issue</span>
                </a>
            </li>
            <li>
                <a onclick="tab_selection(2)">
                    <span class="icon is-small"><i class="fas fa-binoculars" aria-hidden="true"></i></span>
                    <span>View</span>
                </a>
            </li>
            <li>
                <a onclick="tab_selection(3)">
                    <span class="icon is-small"><i class="fas fa-clipboard-list" aria-hidden="true"></i></span>
                    <span>Reports</span>
                </a>
            </li>
        </ul>
    </div>
    {{--<div class="nv_box">
        <button onclick="tab_selection(0);">Add</button>
        <button onclick="tab_selection(1);">Issue</button>
        <button onclick="tab_selection(2);">View</button>
        <button onclick="tab_selection(3);">Reports</button>
        <button onclick="tab_selection(4);">New Item</button>
    </div>--}}

    <div class="container" id="grid_area"></div>

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

        function get_user_station() {
            return get_stations().find( function(station) {
                return station.id === get_user().station_id;
            });
        }

        function getCSRF() {
             return '{{ csrf_token() }}';
        }
    </script>

    <script src="{{ asset('js/inventory.js') }}"></script>
@endsection
