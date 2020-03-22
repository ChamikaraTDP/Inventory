<div class="grid_container">
    <div class="grid_middle" id="add_grid_middle">
        <form id="myForm">
            <div>
                <ol>
                    <li>
                        <label for="form_in_1">Date:</label>
                        <input id="form_in_1" class="ad_fm_inp" type="date" name="date" required/>
                    </li>
                    <li>
                        <label for="form_in_2">Received From:</label>
                        <input id="form_in_2" class="ad_fm_inp" type="text" name="supplier" required/>
                    </li>
                    <li>
                        <label for="form_in_3">Issue Order No:</label>
                        <input id="form_in_3" class="ad_fm_inp" type="text" name="issue_no" required/>
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
                    <label for="form_in_4">Description:</label>
                    <input id="form_in_4" type="text" class="ad_fm_inp" name="description"/>
                </div>
                <div class="ad_sub_btn_dv">
                    <input id="add_sub_btn" type="submit" value="submit" class="add_btn sub_btn"/>
                </div>
                <button id="model_btn" type="button">Open</button>
            </div>
        </form>
    </div>
</div>

<div id="my_model" class="model">
    <div class="model_content">
        <span class="close">&times;</span>
        <p>This is my first model window</p>
    </div>
</div>
