<div class="columns is-centered">
    <div class="column is-8 box">
        <nav class="level b_side_pd_3">
            <div class="level-left">
                <div class="level-item">
                    <label style="width: 9rem" class="label" for="from_inp">From</label>:
                </div>
                <div class="level-item">
                    <input id="from_inp" class="form_input" type="date">
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                   <label style="width: 8rem;" class="label" for="to_inp">To</label>:
                </div>
                <div style="width: 10rem; justify-content: left" class="level-item">
                    <input id="to_inp" class="form_input" type="date">
                </div>
            </div>
        </nav>
        <nav class="level b_side_pd_3">
            <div class="level-left">
                <div class="level-item">
                    <label style="width: 9rem" class="label" for="from_inp">Transaction type</label>:
                </div>
                <div class="level-item">
                    <div class="select">
                        <select id="tran_type">
                            <option value="rcv">Receipts</option>
                            <option value="isu">Issues</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                   <label style="width: 8rem;" class="label" for="to_inp">Item type</label>:
                </div>
                <div style="width: 10rem; justify-content: left" class="level-item">
                    <div class="select">
                        <select id="itm_type">
                            <option value="all">All</option>
                            <option value="bulk">Bulk</option>
                            <option value="inv">Inventory</option>
                        </select>
                    </div>
                </div>
            </div>
        </nav>
        <nav class="level b_side_pd_3">
            <div class="level-left"></div>
            <div class="level-right">
                <div style="width: 10rem; justify-content: left" class="level-item">
                    <button id="create_btn" class="button is-primary">Create</button>
                </div>
            </div>
        </nav>
        <div id="report_table">
            <item-table :items="item_data" :q_data="query_data"></item-table>
        </div>
    </div>
</div>

<div id="isu_mdl" class="model">
</div>
