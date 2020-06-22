<div class="columns is-mobile is-centered">
    <div style="padding: 2rem" class="column is-10 box auto_overflow">
        <form id="ad_itm_form">

            <div class="padding_left_20">
                <div class="padding_bottom_8">
                    <div class="auto_overflow">
                        <label for="ad_fm_date" class="label_float width_8">Received Date</label>
                        <span class="float_left padding_right_5">:</span>
                        <input id="ad_fm_date" class="input_float form_input" type="date" name="date" required/>
                    </div>
                </div>
                <div class="padding_bottom_8">
                    <div class="auto_overflow">
                        <label for="ad_fm_sup" class="label_float width_8">Received From</label>
                        <span class="float_left padding_right_5">:</span>
                        <input id="ad_fm_sup" class="input_float form_input" type="text"
                               name="supplier" maxlength="100" pattern=".*[A-Za-z]+.*"
                               title="should contain letters" required/>
                    </div>
                </div>
                <div class="padding_bottom_8">
                    <div class="auto_overflow">
                        <label for="ad_fm_isn" class="label_float width_8">Issue Note No</label>
                        <span class="float_left padding_right_5">:</span>
                        <input id="ad_fm_isn" class="input_float form_input" type="text"
                               name="issue_no" maxlength="100" pattern="[\w\s]*\w+[\w\s]*"
                               title="should contain letters and numbers" required/>
                        {{--<span style="float: left" class="help is-danger">Issue Note No may contain letters and numbers</span>--}}
                    </div>
                </div>
            </div>


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
                <div class="padding_left_20 field">
                    <label class="label" for="ad_fm_des">Description</label>
                    <div class="control padding_right_20">
                        <textarea id="ad_fm_des"
                                  class="textarea"
                                  name="description"
                                  placeholder="type your description"
                                  rows="1"
                        ></textarea>
                    </div>
                </div>
                <div class="level">
                    <div class="level-left"></div>
                    <div class="level-right">
                        <p  style="margin-top: 1rem" class="level-item padding_right_20">
                            <button id="add_sub_btn" class="button is-link is-outlined" type="submit">
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
