<div class="columns is-variable is-2">

    {{--<div class="column is-2">
        <h6>Filer & search</h6>
    </div>--}}

    <div style="margin-right: var(--column-margin-right)" class="column is-7 box auto_overflow">
        <h5 style="padding-left: var(--title-padding-left)" class="title is-5">Items in Station</h5>
        <table class="table is-fullwidth is-hoverable">
            <thead>
            <tr>
                <th>Category</th>
                <th>Item Name</th>
                <th>Available Quantity</th>
                <th>Issuing Quantity</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody id="itm_tbl_bd"></tbody>
        </table>
    </div>

    <div class="column is-5 box auto_overflow">
        <h5 style="padding-left: var(--title-padding-left)" class="title is-5">Issuing List</h5>
        <table id="isu_lst_tbl" class="table is-fullwidth is-hoverable">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="isu_tbl_bd"></tbody>
        </table>
        <div id="rcv_stn_dv" class="padding_all_4 auto_overflow clearfix"></div>
        <div id="rcv_usr_dv" class="padding_all_4 auto_overflow clearfix"></div>
        <div class="padding_all_4 auto_overflow clearfix">
            <label for="isu_date" class="label_float width_10">Date</label>
            <span class="float_left padding_right_5">:</span>
            <input id="isu_date"  class="form_input input_float" type="date" name="isu_date" required/>
        </div>
        <div class="level is-mobile">
            <div class="level-left"></div>
            <div class="level-right">
                <p class="level-item">
                    <button id="isu_sub_btn" style="margin: 1rem 1rem 0.5rem 0"
                            class="button is-link is-outlined" type="button">
                        submit
                    </button>
                </p>
            </div>
        </div>
    </div>
</div>
<div id="isu_mdl" class="model">
</div>
