<div class="columns is-variable is-2">

    <div style="margin-right: var(--column-margin-right)" class="column is-7 box auto_overflow">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <h5 style="padding-left: var(--title-padding-left)" class="title is-5">Items in Station</h5>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                    <div class="field">
                        <p class="control has-icons-left">
                            <input id="search_input" class="input is-rounded" type="email" placeholder="Search">
                            <span class="icon is-small is-left">
                              <i class="fas fa-search"></i>
                            </span>
                        </p>
                    </div>
{{--                    <input class="input is-rounded" type="text" placeholder="Rounded input">--}}
                </div>
            </div>
        </div>
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
        <div class="padding_all_4 auto_overflow clearfix">
            <label for="isu_lst_des" class="label_float width_10">Description :</label>
            <textarea id="isu_lst_des" class="textarea" name="description" rows="1"></textarea>
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

<div id="isu_mdl" class="model"></div>
