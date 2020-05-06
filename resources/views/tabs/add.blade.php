<div class="columns is-mobile is-centered">
    <div class="column is-10 box auto_overflow">
        <form id="ad_itm_form">

            <ol class="padding_left_20">
                <li class="padding_all_4">
                    <div class="auto_overflow">
                        <label for="ad_fm_date" class="label_float">Date :</label>
                        <input id="ad_fm_date" class="input_float form_input" type="date" name="date" required/>
                    </div>
                </li>
                <li class="padding_all_4">
                    <div class="auto_overflow">
                        <label for="ad_fm_sup" class="label_float">Received From :</label>
                        <input id="ad_fm_sup" class="input_float form_input" type="text" name="supplier" required/>
                    </div>
                </li>
                <li class="padding_all_4">
                    <div class="auto_overflow">
                        <label for="ad_fm_isn" class="label_float">Issue Note No :</label>
                        <input id="ad_fm_isn" class="input_float form_input" type="text" name="issue_no" required/>
                    </div>
                </li>
            </ol>


            <table id="item_tbl" class="table is-fullwidth">
                <thead>
                    <tr>
                        <th>Item Category</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Unit Value(Rs/-)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="tbl_body"></tbody>
            </table>

            <div class="ad_btm_area">
                <div class="padding_left_20">
                    <label for="ad_fm_des">Description:</label>
                    <input id="ad_fm_des" class="form_input" type="text" name="description"/>
                </div>
                <div class="level">
                    <div class="level-left"></div>
                    <div class="level-right">
                        <p class="level-item">
                            <button id="add_sub_btn" style="margin: 0 2rem 1rem 0"
                                    class="button is-link is-outlined" type="submit">
                                Submit
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

<div id="ad_mdl" class="model"></div>
