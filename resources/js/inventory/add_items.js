import { get_parent, make_list } from './helpers/utils';
export { init_add_tab };

function init_add_tab() {
    insert_row();

    document.getElementById('ad_itm_form').addEventListener('submit', function(event) {
        event.preventDefault();
        take_on_submit();
    });
}

/**
 * insert add form rows
 *
 * @callers add_btn, reset_form(), get_add_tab() inventory_main.js
 * @param {node} current add_btn node that called insert_row
 * @use make_list(), make_item_list()
 */
function insert_row(current) {
    const table = document.getElementById('tbl_body');
    if(!table){
        throw new Error(' no table body exists with id=tbl_body ');
    }
    const row_count = table.rows.length;
    if (row_count > 0 && !current){
        throw new Error(' no calling add button passed! ');
    }
    const row = table.insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);

    cell1.setAttribute('class', 'ad_cat_td');
    cell1.innerHTML = `<select class='ad_cat_drop' name='category'>${ make_list(window.get_categories()) }</select>`;
    cell1.firstChild.addEventListener('change', function(){
        make_item_list(this);
    });
    cell2.innerHTML = `<select class="ad_itm_drop" name='item'></select>`;
    cell2.setAttribute('class', 'ad_itm_td');
    make_item_list(cell1.querySelector("select[name='category']"));

    cell3.innerHTML = `<input class='ad_fm_inp' type='number' name='quantity' min="1" required>`;
    cell4.innerHTML = `<input class='ad_fm_inp' type='number' name='unit_price' min='0'>`;
    cell5.innerHTML = `<button class='add_btn' type='button' name="ad_btn">Add</button>` +
        `<button class='rm_btn' style='visibility: hidden' type='button' name="rm_btn">Remove</button>`;

    cell5.querySelector("button[name='ad_btn']").addEventListener('click', function() {
        insert_row(this);
    });
    const rm_btn = cell5.querySelector("button[name='rm_btn']");
    rm_btn.addEventListener('click', function() {
        delete_row(this);
    });
    // configure buttons
    if (row_count > 0) {
        current.style.visibility = 'hidden';
        current.parentNode.querySelector("button[name='rm_btn']").style.visibility = 'visible';
        rm_btn.style.visibility = 'visible';
    }


    /**
     * remove rows from the table
     *
     * @param {node} current rm_btn node that called delete_row
     */
    function delete_row(current) {
        if(!current) {
            throw new Error(' calling delete button not passed! ');
        }
        const row_index = get_parent(current, 'TR').rowIndex;
        if(!row_index || row_index < 0){
            throw new Error(' current is out of context! ');
        }
        const tbl_body = document.getElementById('tbl_body');
        if(!tbl_body) {
            throw new Error(' no table body exists with id=tbl_body ');
        }
        const rows = tbl_body.rows;
        const row_count = rows.length;

        try {
            tbl_body.deleteRow(row_index - 1);
        }
        catch (exp) {
            throw new Error(' error occurred during raw removal ');
        }

        if (row_index === row_count) {
            rows[row_index - 2].querySelector("button[name='ad_btn']").style.visibility = 'visible';
        }
        if (row_count === 2) {
            rows[0].querySelector("button[name='rm_btn']").style.visibility = 'hidden';
        }
    }

    /**
     * make items dropdown *
     *
     * @param {node} node table>td>select node representing the category dropdown
     * @use items global
     * @use make_list()
     */
    function make_item_list(node) {
        if(!node){
            throw new Error(' node parameter is undefined! ');
        }
        if(node.tagName !== 'SELECT'){
            throw new Error(' pass invalid element as node, must provide a "select element" ');
        }
        if(!window.get_items()){
            throw new Error(' items not defined globally! ');
        }
        //items dropdown td node
        const item_select = get_parent(node, 'TR').querySelector("select[name='item']");
        if(item_select) {
            const cat_items = (window.get_items()).filter(function(item) {
                return item.category_id == node.value;
            });
            item_select.innerHTML = make_opt_list(cat_items);
        }
        else {
            throw Error(' no select element found to attach the list ');
        }

        function make_opt_list(items) {
            if (!items) {
                throw new Error(' items undefined!');
            }
            if (typeof items !== 'object' ) {
                throw new Error(' items must be a json object ');
            }

            let list = ``,
                item = {};
            for (item of items) {
                list += `<option value='{ "id": ${item.id}, "type": ${item.type} }'>${item.name}`;
            }
            return list;
        }
    }
}


/**
 * initialize add form so that it can be submitted using submit btn
 *
 * @caller get_add_tab() inventory_main.js
 *
 */
function take_on_submit() {
    const form = document.getElementById('ad_itm_form');
    const ad_model = document.getElementById('ad_mdl');

    display_model();

    function display_model() {
        let ad_mdl_cont =
            `<div id="ad_mdl_cont" class="mdl_cont">
                <span id="ad_mdl_close" class="mdl_close">&times</span>
                <div>
                    <div>Add items to stock</div>
                    <div>
                        <div style="display: inline-block">
                           <div>Received From: ${ form.querySelector('#ad_fm_sup').value }</div>
                           <div>Date: ${ form.querySelector('#ad_fm_date').value }</div>
                        </div>
                        <div style="display: inline-block">
                            <div>Issue Note no: ${ form.querySelector('#ad_fm_isn').value }</div>
                        </div>
                    </div>
                    <div>
                        <table id="ad_mdl_tbl">
                            <thead>
                                <tr>
                                    <th>Item Category</th>
                                    <th>Item Name</th>
                                    <th>Quantity</th>
                                    <th>Unit Value(Rs/-)</th>
                                </tr>
                            </thead>
                            <tbody id="ad_mt_bd">`;

        let rows = form.querySelector('#tbl_body').rows,
            form_len = rows.length,
            md_tbl_rows= ``,
            cat = {},
            itm = {};
        for (let i = 0; i < form_len; i++) {
            cat = rows[i].querySelector("select[name='category']");
            itm = rows[i].querySelector("select[name='item']");

            md_tbl_rows += `<tr> 
                                <td>${ cat.options[cat.selectedIndex].text }</td>
                                <td>${ itm.options[itm.selectedIndex].text }</td>
                                <td>${ rows[i].querySelector("input[name='quantity']").value }</td>
                                <td>${ rows[i].querySelector("input[name='unit_price']").value }</td>
                            </tr>`;
        }

        ad_mdl_cont += `${ md_tbl_rows }</tbody>
                    </table>
                </div>
            </div>
            <div class="clearfix">
                <p>Description: ${ form.querySelector('#ad_fm_des').value }</p>
                <button id="mdl_conf_btn" type="button" class="add_btn mdl_conf_btn">Confirm</button>
            </div>            
        </div>`;

        ad_model.innerHTML = ad_mdl_cont;

        ad_model.querySelector('#mdl_conf_btn').addEventListener('click', sendData);
        ad_model.querySelector('#ad_mdl_close').addEventListener('click', function() {
            ad_model.style.display = 'none';
        });
        ad_model.style.display = 'block';
    }

    /**
     * xhr to send data to controller
     * send add form data as json string
     *
     * @use reset_form()
     */
    function sendData() {
        console.log('initialize form data');
        display_loading();

        const XHR = new XMLHttpRequest();
        const js_obj = {};
        const FD = new FormData(form);

        js_obj.form_details = {
            "date": FD.get('date'),
            "supplier": FD.get('supplier'),
            "issue_no": FD.get('issue_no'),
            "description": FD.get('description'),
        };

        js_obj.item_details = {
            'bulk' : [],
            'inv' : []
        };

        let form_len = FD.getAll('item').length,
            itm = {};
        for (let i = 0; i < form_len; i++) {
            itm = FD.getAll('item')[i];
            itm = JSON.parse(itm);
            if(itm.type) { // === 1 true -> inventory
                js_obj.item_details.inv.push(
                    {
                        "item_id": itm.id,
                        "quantity": FD.getAll('quantity')[i],
                        "unit_price": (FD.getAll('unit_price')[i] === '' ? 0 : FD.getAll('unit_price')[i]),
                    }
                );
            }
            else {
                js_obj.item_details.bulk.push(
                    {
                        "item_id": itm.id,
                        "quantity": FD.getAll('quantity')[i],
                        "unit_price": (FD.getAll('unit_price')[i] === '' ? 0 : FD.getAll('unit_price')[i]),
                    }
                );
            }
        }

        XHR.addEventListener('load', function(event) {
            console.log('response loaded');

            if (event.target.status === 200) {
                console.log(event.target.responseText);
                reset_form();
                display_success();
            } else {
                console.log(event.target.status + ' ' + event.target.statusText);
                alert('Something went wrong:(');
            }
        });
        XHR.addEventListener('abort', function(event) {
            console.log('request aborted' + event.target.responseText);
        });
        XHR.addEventListener('error', function(event) {
            console.log('something went wrong' + event.target.responseText);
        });
        XHR.open('POST', '/inventory/transaction/stock/put', true);
        XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // eslint-disable-next-line no-undef
        XHR.send('_token=' + getCSRF() + '&' + 'data=' + JSON.stringify(js_obj));
    }

    function display_loading() {
        const mdl_cont = ad_model.querySelector('#ad_mdl_cont');
        mdl_cont.innerHTML = `<p>processing request please wait...</p>`;
    }

    function display_success() {
        const mdl_cont = ad_model.querySelector('#ad_mdl_cont');
        mdl_cont.innerHTML = `<span id="ad_mdl_close" class="mdl_close">&times;</span>
                    <p>Items added successfully:)</p>`;
        mdl_cont.querySelector('#ad_mdl_close').addEventListener('click', function() {
            ad_model.style.display = 'none';
        });
    }

    /**
     * reset add form after submission
     *
     * @use insert_row
     */
    function reset_form(){
        try {
            const rows_to_remove = document.getElementById('tbl_body').childNodes;
            const n_rows = rows_to_remove.length;

            let i = n_rows - 1;
            for (i; i >= 0; i--) {
                rows_to_remove[i].remove();
            }

            form.reset();
            insert_row();
            console.log('form resets successfully');

        } catch (e) {
            console.log('error occurred while resetting the form' + e);
        }
    }
}
