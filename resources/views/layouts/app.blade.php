<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

</head>
<body>
    <div id="app">
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item" href="{{ url('/inventory') }}">
                    <p style="font-size: var(--navbar-brand-font-size)">{{ config('app.name', 'Laravel') }}</p>
                </a>
                <a id="nv_burg" role="button" class="navbar-burger"
                   aria-label="menu" aria-expanded="false">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div id="nv_menu" class="navbar-menu">
                <div class="navbar-start"></div>
                <div class="navbar-end">
                    @guest
                        <div class="navbar-item">
                            <div class="buttons">
                                <a class="button is-primary" href="{{ route('login') }}">
                                    <strong>{{ __('Login') }}</strong>
                                </a>
                                @if (Route::has('register'))
                                    <a class="button is-light" href="{{ route('register') }}">{{ __('Register') }}</a>
                                @endif
                            </div>
                        </div>
                    @else
                        <div class="navbar-item">
                            <p style="font-size: var(--navbar-menu-font-size)">{{ Auth::user()->station->name }}</p>
                        </div>
                        <div id="nav_drops"
                           class="navbar-item has-dropdown" onClick="this.classList.toggle('is-active')">
                            <a class="navbar-link">
                                {{ Auth::user()->name }}
                            </a>
                            <div class="navbar-dropdown is-right">
                                <a class="navbar-item" href="{{ route('logout') }}" onclick="event.preventDefault();
                                   document.getElementById('logout-form').submit();">
                                    {{ __('Logout') }}
                                </a>
                                <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                    @csrf
                                </form>

                              @if(Gate::allows('edit_settings'))
                                <a class="navbar-item" href="{{ route('admin') }}">
                                    {{ __('Admin') }}
                                </a>
                              @endif

                              @can('create', \App\Item::class)
                                <a class="navbar-item" href="{{ route('item_index') }}">
                                    {{ __('New Item') }}
                                </a>
                              @endcan

                            </div>
                        </div>
                    @endguest
                </div>
            </div>
        </nav>

        <main class="py-4">
            @yield('content')
        </main>

    </div>

    <!-- Scripts -->
    <script>

        window.addEventListener('load', function () {
            document.getElementById('nv_burg').addEventListener('click', function () {
                document.querySelector('#nv_burg').classList.toggle('is-active');
                document.querySelector('#nv_menu').classList.toggle('is-active');
            });
        });

    </script>

    @if (Auth::check())
        <script>
            window.addEventListener('click', function(event) {
                if(!event.target.matches('.navbar-link')){
                    var drop_down = document.getElementById('nav_drops');
                    drop_down.classList.toggle('is-active', false);
                }
            });
        </script>
    @endunless


    @yield('js_area')

</body>
</html>
