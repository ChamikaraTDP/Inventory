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
    return redirect('/inventory');
});

Auth::routes(['register' => false]);

// test page
Route::get('/tests', 'HomeController@tests')->name('tests');

// Front door to the inventory
Route::get('/inventory', 'HomeController@index')->name('inventory');

// Add tab
Route::view('/inventory/tab/add', '/tabs/add')->middleware('can:create, App\InventoryItem')->name('tab_add');

// Issue tab for stock
Route::get('/inventory/tab/issue/stock', 'TabsController@stk_issue')->name('tab_stk_issue');

// Issue tab for other stations
Route::get('/inventory/tab/issue/station', 'TabsController@stn_issue')->name('tab_stn_issue');

// View tab
Route::get('/inventory/tab/view', 'TabsController@view')->name('tab_view');

// Reports tab
Route::get('/inventory/tab/reports', 'TabsController@reports')->name('tab_reports');

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

// Issue items from other stations
Route::post('/inventory/transaction/station/issue', 'TransactionController@station_issue')->name('transaction_station_issue');

// Generate reports specific to the stock
Route::post('/inventory/report/stock', 'ReportsController@stock')->name('reports_stock');

// Generate reports
Route::post('/inventory/report', 'ReportsController@generate')->name('reports_generate');

// Admin panel
Route::view('/inventory/admin', 'admin')->middleware('can:edit_settings')->name('admin');

// Admin panel
Route::get('/inventory/admin/get', 'HomeController@get_all')->name('home_get_all');

// Create users
Route::post('/inventory/users/create', 'UserController@create')->name('user_create');

// Retrieve users
Route::get('/inventory/users/index', 'UserController@index')->name('user_index');

// Update users
Route::patch('/inventory/users/update', 'UserController@update')->name('user_update');

// Delete users
Route::delete('/inventory/users/delete', 'UserController@delete')->name('user_delete');

// Retrieve users
Route::get('/inventory/stations/index', 'StationController@index')->name('station_index');

// Update InventoryItems
Route::post('/inventory/inventory-items/update', 'InventoryItemController@update')->name('inventory_item_update');

// Update InventoryItems
Route::delete('/inventory/inventory-items/delete', 'InventoryItemController@delete')->name('inventory_item_delete');



// Route that will be executed when no other route matches the incoming request
Route::fallback(function () {
    return response()->json(
        ['message' => 'Page Not Found! If error persists, contact Chamikara'], 404
    );
});
