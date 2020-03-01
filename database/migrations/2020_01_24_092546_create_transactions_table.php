<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->date('issuing_date')->nullable();
            $table->string('issue_no')->nullable();
            $table->unsignedBigInteger('issued_by')->nullable();
            $table->unsignedBigInteger('issuing_station')->nullable();
            $table->string('receipt_no')->nullable();
            $table->unsignedBigInteger('received_by')->nullable();
            $table->unsignedBigInteger('receiving_station')->nullable();
            $table->string('transaction_type')->nullable();
            $table->string('supplier')->nullable();
            $table->date('accepted_date')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();

            $table->foreign('issued_by')->references('id')->on('users');
            $table->foreign('received_by')->references('id')->on('users');
            $table->foreign('issuing_station')->references('id')->on('stations');
            $table->foreign('receiving_station')->references('id')->on('stations');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}
