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

// test page
Route::get('/tests', 'HomeController@tests')->name('tests');

// Front door to the inventory
Route::get('/inventory', 'HomeController@index')->name('inventory');

// Add tab
Route::view('/inventory/tab/add', '/tabs/add')->name('tab_add');

// Issue tab
Route::get('/inventory/tab/issue', 'TabsController@issue')->name('tab_issue');

// View tab
Route::get('/inventory/tab/view', 'TabsController@view')->name('tab_view');

// View / all  tab
Route::get('/inventory/tab/view/all', 'TransactionController@all')->name('transaction_all');

// View / receipts tab
Route::get('/inventory/tab/view/receipts', 'TransactionController@receipts')->name('transaction_receipts');

// View / issues tab
Route::get('/inventory/tab/view/issues', 'TransactionController@issues')->name('transaction_issues');

// Retrieve transactions matching the search phase
Route::get('/inventory/transaction/search', 'TransactionController@search')->name('transaction_search');

// Retrieve all the items of a to_stock transaction
Route::get('/inventory/transaction/stock/{id}', 'TransactionController@to_stock_items')->name('transaction_to_stock_items');

// Retrieve all the items of a transaction
Route::get('/inventory/transaction/{id}', 'TransactionController@all_items')->name('transaction_all_items');

// Add new item view
Route::get('/inventory/new/item', 'ItemController@index')->name('item_index');

// Add new item to db
Route::post('/inventory/new/item/create', 'ItemController@create')->name('item_create');

// Add items to stock
Route::post('/inventory/transaction/stock/put', 'TransactionController@put')->name('transaction_put');

// Issue items from stock
Route::post('/inventory/transaction/stock/issue', 'TransactionController@stock_issue')->name('transaction_stock_issue');

// Route that will be executed when no other route matches the incoming request
Route::fallback(function () {
    return response()->json(
        ['message' => 'Page Not Found! If error persists, contact Chamikara'], 404
    );
});
