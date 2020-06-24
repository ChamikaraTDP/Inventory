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

    <div id="reset_mdl" class="model">
        <div id="reset_mdl_cont" class="mdl_cont">
            <p>Someone changed the stocks, page resets...</p>
        </div>
    </div>

    <div id="spinner" class="spinner">
        <figure class="image is-128x128">
            <img src="/images/loading.gif" alt="loading spinner">
        </figure>
    </div>

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

        /**
         *
         * @returns {Object} {
         *     "id":,
         *     "name":,
         *     "user_type":,
         *     "station_id:"
         * }
         */
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

    <script>
        window.addEventListener('load', function() {
            tab_selection(1);

            Ech0.private(`station-${ get_user().station_id }`)
                .listen('StockChanged', (event) => {
                    if(document.getElementById('tab_1').classList.contains('is-active')) {
                        console.log(`stock changed by ${ event.user.name }`);
                        if (event.user.id === get_user().id) {
                            tab_selection(1);
                        } else {
                            var rst_mdl = document.getElementById('reset_mdl');

                            rst_mdl.style.display = 'block';

                            rst_mdl.addEventListener('click', function() {
                                rst_mdl.style.display = 'none';
                            });

                            tab_selection(1);
                        }
                    }
                });
        });
    </script>
@endsection
