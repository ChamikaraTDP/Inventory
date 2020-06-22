<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInventoryItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('item_id');
            $table->text('item_code')->nullable();
            $table->text('serial_no')->nullable();
            $table->integer('price')->nullable();
            $table->unsignedBigInteger('current_station')->nullable();
            $table->string('status', 10)->default('good');
            $table->timestamps();

            $table->foreign('item_id')->references('id')->on('items');
            $table->foreign('current_station')->references('id')->on('stations');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inventory_items');
    }
}
