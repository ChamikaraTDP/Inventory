@extends('layouts.app')

@section('content')

    <div id="root" class="container">
        <div class="columns is-centered">
            <div class="column is-8">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <h2 class="subtitle is-2">Admin Tools</h2>
                        </div>
                    </div>
                    <div class="level-right"></div>
                </div>
                <tabs></tabs>
            </div>
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
        function get_user() {
            var user = @json(auth()->user());
            return user;
        }
    </script>

    <script src="{{ asset('js/admin_panel.js') }}"></script>
@endsection
