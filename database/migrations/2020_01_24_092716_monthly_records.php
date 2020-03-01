<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MonthlyRecords extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        schema::create('monthly_records', function (Blueprint $table){
            $table->bigIncrements('id');
            $table->string('month')->nullable();
            $table->unsignedBigInteger('station_id')->nullable();
            $table->unsignedBigInteger('item_id')->nullable();
            $table->integer('quantity')->nullable();
            $table->timestamps();

            $table->foreign('station_id')->references('id')->on('stations');
            $table->foreign('item_id')->references('id')->on('items');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('monthly_records');
    }
}
