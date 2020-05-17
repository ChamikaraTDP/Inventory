@extends('layouts.app')

@section('content')
    <!-- navigation bar -->
    <div class="tabs is-centered is-boxed">
        <ul>
            @can('create', \App\InventoryItem::class)
            <li id="tab_0" class="is-active">
                <a onclick="tab_selection(0)">
                    <span class="icon is-small"><i class="fas fa-warehouse" aria-hidden="true"></i></span>
                    <span>Add</span>
                </a>
            </li>
            @endcan
            <li id="tab_1">
                <a onclick="tab_selection(1);">
                    <span class="icon is-small"><i class="fas fa-file-signature" aria-hidden="true"></i></span>
                    <span>Issue</span>
                </a>
            </li>
            <li id="tab_2">
                <a onclick="tab_selection(2)">
                    <span class="icon is-small"><i class="fas fa-binoculars" aria-hidden="true"></i></span>
                    <span>View</span>
                </a>
            </li>
            <li id="tab_3">
                <a onclick="tab_selection(3)">
                    <span class="icon is-small"><i class="fas fa-clipboard-list" aria-hidden="true"></i></span>
                    <span>Reports</span>
                </a>
            </li>
        </ul>
    </div>

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

        window.onclick = function(event) {
            if(!event.target.matches('.navbar-link')){
                const drop_down = document.getElementById('nav_drops');
                drop_down.classList.toggle('is-active', false);
            }
        };
    </script>

    <script src="{{ asset('js/inventory.js') }}"></script>
@endsection
