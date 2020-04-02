<div class="grid_container">
    <div class="grid_middle" id="add_grid_middle">
        <form id="ad_itm_form">
            <div>
                <ol>
                    <li>
                        <label for="ad_fm_data">Date:</label>
                        <input id="ad_fm_date" class="ad_fm_inp" type="date" name="date" required/>
                    </li>
                    <li>
                        <label for="ad_fm_sup">Received From:</label>
                        <input id="ad_fm_sup" class="ad_fm_inp" type="text" name="supplier" required/>
                    </li>
                    <li>
                        <label for="ad_fm_isn">Issue Note No:</label>
                        <input id="ad_fm_isn" class="ad_fm_inp" type="text" name="issue_no" required/>
                    </li>
                </ol>
            </div>
            <table id="item_tbl">
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
                <div>
                    <label for="ad_fm_des">Description:</label>
                    <input id="ad_fm_des" type="text" class="ad_fm_inp" name="description"/>
                </div>
                <div class="ad_sub_btn_dv">
                    <input id="add_sub_btn" type="submit" class="add_btn sub_btn" value="submit">
                </div>
            </div>
        </form>
    </div>
</div>

<div id="ad_mdl" class="model">
</div>
