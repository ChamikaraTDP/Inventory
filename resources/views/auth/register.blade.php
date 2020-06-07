@extends('layouts.app')

@section('content')
<div class="container">
    <div class="columns is-centered">
        <div class="column is-6">
            <div class="card">
                <header class="card-header">
                    <div class="card-header-title is-centered">{{ __('Register') }}</div>
                </header>

                <div class="card-content">
                    <form method="POST" action="{{ route('register') }}">
                        @csrf
                        <div class="field">
                            <label class="label" for="name">{{ __('Name') }}</label>

                            <div class="control">
                                <input id="name" type="text"
                                       class="input @error('name') is-danger @enderror"
                                       name="name" value="{{ old('name') }}"
                                       maxlength="255"
                                       autocomplete="name"
                                       pattern="^(?=.*[A-Za-z]).*$"
                                       title="should contain some letters"
                                       required autofocus>

                                @error('name')
                                <span class="help is-danger" role="alert">
                                        {{ $message }}
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="field">
                            <label class="label" for="branch">{{ __('Station') }}</label>

                            <div class="control">
                                <div class="select">
                                    <select id="branch" name="branch" required>
                                        <option value="">Select Station</option>

                                        @foreach(\App\Station::all() as $station)
                                            <option value="{{ $station->id }}"
                                                {{ old('branch') == $station->id ? 'selected' : '' }}>
                                                {{ $station->name }}
                                            </option>
                                        @endforeach

                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label for="username" class="label">{{ __('Username') }}</label>

                            <div class="control">
                                <input id="username"
                                       type="text"
                                       class="input @error('username') is-danger @enderror"
                                       name="username" value="{{ old('username') }}"
                                       pattern="[\w]+"
                                       title="may contain letters and numbers,
                                            Minimum 4 characters, Maximum 20 characters."
                                       autocomplete="username"
                                       minlength="4" maxlength="20"
                                       required autofocus>

                                @error('username')
                                <span class="help is-danger" role="alert">
                                        {{ $message }}
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="field">
                            <label for="password" class="label">{{ __('Password') }}</label>

                            <div class="control">
                                <input id="password" type="password"
                                       class="input @error('password') is-danger @enderror"
                                       name="password"
                                       minlength="8"
                                       maxlength="255"
                                       autocomplete="new-password"
                                       pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}$"
                                       title="Should contain minimum 8 characters,
                                            Uppercase and Lowercase characters and numbers."
                                       required>

                                @error('password')
                                <span class="help is-danger" role="alert">
                                        {{ $message }}
                                    </span>
                                @enderror
                            </div>
                        </div>

                        <div class="field">
                            <label for="password-confirm" class="label">{{ __('Confirm Password') }}</label>

                            <div class="control">
                                <input id="password-confirm"
                                       type="password"
                                       class="input"
                                       name="password_confirmation"
                                       autocomplete="new-password"
                                       minlength="8"
                                       maxlength="255"
                                       pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}$"
                                       title="Should contain minimum 8 characters,
                                        Uppercase and Lowercase characters and numbers."
                                       required>
                            </div>
                        </div>

                        <div class="field">
                            <div class="control">
                                <button type="submit" class="button is-link">
                                    {{ __('Register') }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
