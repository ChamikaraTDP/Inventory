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

Route::view('/add_tab', 'add_tab');

Route::get('/issue_tab', 'TransactionController@load_issue_tab');

Route::get('/inventory', 'HomeController@nav_index')->name('inventory');

//Add item data to db
Route::post('/add_items', 'TransactionController@add_items')->name('add_items');

Route::post('/issue_items', 'TransactionController@issue_items')->name('issue_items');


// Route that will be executed when no other route matches the incoming request
Route::fallback(function () {
    return response()->json(
        ['message' => 'Page Not Found! If error persists, contact Chamikara'], 404
    );
});
