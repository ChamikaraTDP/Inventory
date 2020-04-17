<div class="grid_container issue_grid_container">
    <div class="issue_grid_middle">
        <h5>Items in Station</h5>
        <table>
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

    <div class="issue_grid_left">
        <h5>Filer & search</h5>
        <table>
            <thead>
            <tr>
                <th>Category</th>
                <th>Item Name</th>
            </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <div class="issue_grid_right">
        <h5>Issuing List</h5>
        <table id="isu_lst_tbl">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="isu_tbl_bd"></tbody>
        </table>
        <div id="rcv_stn_dv" style="padding: 10px 10px 2px 10px"></div>
        <div id="rcv_usr_dv" style="padding: 2px 10px"></div>
        <div style="padding: 2px 10px">
            <label for="isu_date">Date:</label><input id="isu_date" type="date" name="isu_date" required/>
        </div>
        <div style="padding: 2px 10px">
            <button id="isu_sub_btn" type="button" class="add_btn sub_btn">submit</button>
        </div>
    </div>
</div>
<div id="isu_mdl" class="model">
</div>
