<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateTransInfoView extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("create view
            trans_info(id, isu_date, isu_stn_id, isu_stn, isu_usr, rcv_stn_id, rcv_stn, rcv_usr, type, rcp_no, sup, des)
             as select T.id, T.issuing_date, T.issuing_station, Si.name, Ui.name, T.receiving_station, Sr.name, Ur.name, T.transaction_type, T.receipt_no, T.supplier, T.description
              from (transactions as T left outer join stations as Si on T.issuing_station = Si.id
               left outer join stations as Sr on T.receiving_station = Sr.id
                left outer join users as Ui on T.issued_by = Ui.id
                 left outer join users as Ur on T.received_by = Ur.id)");

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("drop view if exists trans_info");
    }
}
