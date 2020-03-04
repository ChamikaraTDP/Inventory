<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

//test page
Route::get('/home', 'HomeController@index')->name('home');

//Show Add items page
Route::get('/add', 'TransactionController@index')->name('add_items');

//Add item form data to db
Route::post('/send_data', 'TransactionController@send_data')->name('send_data');


// Route that will be executed when no other route matches the incoming request
Route::fallback(function () {
    return response()->json(
        ['message' => 'Page Not Found! If error persists, contact Chamikara'], 404
    );
});
