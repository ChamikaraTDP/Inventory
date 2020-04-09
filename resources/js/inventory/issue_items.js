import { make_list, get_parent } from './helpers/utils';
export { init_isu_tab };

function init_isu_tab(avl_itms) {
    set_item_table(avl_itms);
    set_isu_list();
    document.getElementById('isu_sub_btn').addEventListener('click', handle_submit);
}

/**
 * initialize the avail items table in isu tab
 *
 * @param {array} avl_itms available items in station
 */
function set_item_table(avl_itms) {
    const tbl_bd = document.getElementById('itm_tbl_bd');

    let row = {},
        cell1 = {},
        cell2 = {},
        cell3 = {},
        cell4 = {},
        cell5 = {},
        cat = {},
        item = {};

    for (item of avl_itms) {
        row = document.createElement('TR');
        cell1 = document.createElement('TD');
        cell2 = document.createElement('TD');
        cell3 = document.createElement('TD');
        cell4 = document.createElement('TD');
        cell5 = document.createElement('TD');

        cat = (window.get_categories()).find(function(gcat) {
            return gcat.id === item.category_id;
        });

        cell2.innerHTML = item.name;
        cell2.setAttribute('data-item-id', item.item_id);
        cell2.setAttribute('data-cell', 'name');
        cell1.innerHTML = cat.name;
        cell1.setAttribute('data-cell', 'category');
        cell3.innerHTML = item.quantity;
        cell3.setAttribute('data-cell', 'available');
        cell4.innerHTML = `<input class='isu_qan_inp' type='number' min='1' max='${ item.quantity }'
            name="isu_qt"/>`;

        if(item.type) {
            cell5.innerHTML = `
             <button id='fil_btn_${item.item_id}' class='add_btn isu_ad_btn' type='button'
                name="isu_fil_btn">Fill</button>
             <button  id='isu_drop_btn_${item.item_id}' style="display: none" class='add_btn isu_ad_btn'
                type='button' name="inv_drop_btn">V</button>
             <button  id='add_all_btn_${item.item_id}' style="display: none" class='add_btn isu_ad_btn'
                type='button' name="add_all_btn">All</button>
             <button  id='rmv_all_btn_${item.item_id}' style="display: none" class='rm_btn isu_ad_btn'
                type='button' name="rmv_all_btn">Rmv</button>`;

            cell5.querySelector("button[name='isu_fil_btn']").addEventListener('click', function() {
                disp_fil_list(this);
            });
        } else {
            cell5.innerHTML = `<button class='add_btn isu_ad_btn' type='button' id='isu_ad_btn_${item.item_id}'
            name="isu_ad_btn">Add</button>`;

            cell5.querySelector("button[name='isu_ad_btn']").addEventListener('click', function() {
                itm_to_isu(this);
            });
        }

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(cell5);

        tbl_bd.appendChild(row);
    }

    function disp_fil_list(node) {
        const prn_row = get_parent(node, 'TR');

        const isu_qt = Number(prn_row.querySelector("input[name='isu_qt']").value);
        const av_qt = Number( prn_row.querySelector("td[data-cell='available']").innerText );

        if (isu_qt > av_qt || isu_qt < 1) {
            alert('invalid quantity!');
        }
        else  {
            const row = document.createElement('TR');
            const cell = document.createElement('TD');
            cell.setAttribute('colspan', '5');

            append_divs(cell, isu_qt, prn_row);

            if(isu_qt < av_qt){
                cell.querySelectorAll("button[name='inv_itm_ad_btn']")[isu_qt - 1]
                    .style.display = 'inline-block';
            }

            row.appendChild(cell);
            prn_row.insertAdjacentElement('afterend', row);

            toggle_btns(row, prn_row);
        }


        function append_divs(cell, num, prn_row) {
            let div = {};

            for (let i = 0; i < num; i++) {
                div = document.createElement('DIV');
                div.innerHTML = `
                    <span>
                        <input id="" class='ad_fm_inp' type='text' name='itm_code' placeholder="item code">
                    </span>
                    <span>
                        <input class='ad_fm_inp' type='text' name='serial_no' placeholder="serial number">
                    </span>
                    <span>
                        <button class='add_btn isu_ad_btn' type='button' name="inv_ad_btn">Add</button>
                    </span>
                    <span>
                        <button class='rm_btn isu_ad_btn' type='button' name="inv_itm_rm_btn">Remove</button>
                    </span>
                    <span>
                        <button style="display: none" class='add_btn isu_ad_btn' type='button'
                            name="inv_itm_ad_btn">+</button>
                    </span>`;

                div.querySelector("button[name='inv_itm_rm_btn']")
                    .addEventListener('click', function() {
                        rm_function(div, prn_row, cell);
                    });

                div.querySelector("button[name='inv_itm_ad_btn']").
                    addEventListener('click', function(event) {
                        add_div(event.target, cell, prn_row );
                    });

                cell.appendChild(div);
            }
        }


        function rm_function(cur_div, prn_row, cell) {
            const isu_node = prn_row.querySelector("input[name='isu_qt']");
            const av_qt = Number( prn_row.querySelector("td[data-cell='available']").innerText );
            const count = Number(isu_node.value) - 1;

            isu_node.value = count;

            if(count === 0){
                remove_row(cell.parentNode, prn_row);
                return;
            }

            const last_div = cell.lastElementChild;

            if( cur_div.isSameNode(last_div) ) {
                let prev_btn = cur_div.previousSibling.querySelector("button[name='inv_itm_ad_btn']");
                prev_btn.style.display = 'inline-block';
            }
            else if( count === av_qt - 1 ) {
                last_div.querySelector("button[name='inv_itm_ad_btn']").style.display = 'inline-block';
            }

            cur_div.remove();
        }


        function add_div(ad_btn, cell, prn_row) {
            const isu_node = prn_row.querySelector("input[name='isu_qt']");
            const av_qt = Number( prn_row.querySelector("td[data-cell='available']").innerText );
            const count = Number(isu_node.value) + 1;

            if( count <= av_qt) {
                ad_btn.style.display = 'none';
                append_divs(cell, 1, prn_row);
                isu_node.value = count;

                if( count < av_qt ) {
                    cell.lastElementChild.querySelector(
                        "button[name='inv_itm_ad_btn']").style.display = 'inline-block';
                }
            }
            else {
                alert(' cannot add items more than available ');
            }
        }


        function remove_row(row, prn_row) {
            const drp = prn_row.querySelector("button[name='inv_drop_btn']");
            const rmv = prn_row.querySelector("button[name='rmv_all_btn']");
            const fil = prn_row.querySelector("button[name='isu_fil_btn']");
            const add = prn_row.querySelector("button[name='add_all_btn']");
            const isu = prn_row.querySelector("input[name='isu_qt']");

            drp.removeEventListener('click', tog_row_disp);
            rmv.removeEventListener('click', remove_row);

            drp.style.display = 'none';
            rmv.style.display = 'none';
            add.style.display = 'none';
            fil.style.display = 'inline-block';
            isu.disabled = false;

            row.remove();
        }


        function tog_row_disp(row) {
            if(row.style.display !== 'none') {
                row.style.display = 'none';
            }
            else {
                row.style.display = 'table-row';
            }
        }


        function toggle_btns(row, prn_row) {
            const isu_node = prn_row.querySelector("input[name='isu_qt']");
            const drop = prn_row.querySelector("button[name='inv_drop_btn']");
            const rmv_all = prn_row.querySelector("button[name='rmv_all_btn']");
            const fil_btn = prn_row.querySelector("button[name='isu_fil_btn']");
            const add_all = prn_row.querySelector("button[name='add_all_btn']");

            rmv_all.addEventListener('click', function() {
                remove_row(row, prn_row);
            });

            drop.addEventListener('click', function() {
                tog_row_disp(row);
            });

            isu_node.disabled = true;
            fil_btn.style.display = 'none';
            drop.style.display = 'inline-block';
            add_all.style.display = 'inline-block';
            rmv_all.style.display = 'inline-block';
        }
    }


    /**
     * add items to issuing list
     * @param node add btn
     */
    function itm_to_isu(node) {
        let prn_row = get_parent(node, 'TR');

        let isu_qt = prn_row.querySelector("input[name='isu_qt']").value;
        let av_qt = prn_row.querySelector("td[data-cell='available']").innerText;

        isu_qt = Number(isu_qt);
        av_qt = Number(av_qt);

        if (isu_qt > av_qt || isu_qt < 1) {
            alert('invalid input');
        } else {
            const row = document.createElement('TR');

            let cell1 = prn_row.querySelector("td[data-cell='name']");
            const cell2 = document.createElement('TD');
            const cell3 = document.createElement('TD');

            cell1 = cell1.cloneNode(true);
            cell2.innerHTML = String(isu_qt);
            cell2.setAttribute('data-cell', 'quantity');
            cell3.innerHTML = `<button type='button' class='rm_btn isu_ad_btn' name="isu_rm_btn">
                Remove</button>`;

            cell3.querySelector("button[name='isu_rm_btn']").addEventListener(
                'click',function() {
                    const ad_btn_id = 'isu_ad_btn_' + cell1.getAttribute('data-item-id');
                    itm_fm_isu(this, ad_btn_id);
                }
            );

            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);

            document.getElementById('isu_tbl_bd').appendChild(row);

            node.disabled = true;
            node.setAttribute('class', 'add_btn isu_ad_btn ad_btn_dis');
            prn_row.querySelector("input[name='isu_qt']").disabled = true;
        }

        /**
         * remove rows form issuing list
         *
         * @param {node} node remove btn
         * @param {string} ad_btn id of the add btn who made this row
         */
        function itm_fm_isu(node, ad_btn) {
            get_parent(node, 'TR').remove();
            ad_btn = document.getElementById(ad_btn);
            ad_btn.disabled = false;
            ad_btn.setAttribute('class', 'add_btn isu_ad_btn');
            let prn_row = get_parent(ad_btn, 'TR');
            prn_row.querySelector("input[name='isu_qt']").disabled = false;
        }
    }
}

/**
 * create receiving station & receiving officer dropdowns
 *
 * @use make_list()
 */
function set_isu_list() {
    const stations = window.get_stations().filter(function(station) {
        return window.get_user().station_id !== station.id;
    });
    const list = make_list(stations);
    const stn_drp_dv = document.getElementById('rcv_stn_dv');
    stn_drp_dv.innerHTML = `<label for='rcv_stn'>Receiving Station:</label>
        <select id='rcv_stn' name='rcv_stn'>${ list }</script>`;

    const rcv_stn = document.getElementById('rcv_stn');

    rcv_stn.addEventListener('change', (event) => {
        make_usr_list(event.target.value);
    });

    make_usr_list(rcv_stn.value);

    function make_usr_list(stn_id) {
        const stn_users = (window.get_users()).filter(function (usr) {
            return usr.station_id == stn_id;
        });

        const list = make_list(stn_users);
        document.getElementById('rcv_usr_dv').innerHTML = `<label for='rcv_usr'>Receiving Officer:</label>
            <select id='rcv_usr' name='rcv_usr'>${ list }</script>`;
    }
}


function handle_submit() {
    const isu_tbl = document.getElementById('isu_lst_tbl'),
        rcv_stn = document.getElementById('rcv_stn'),
        rcv_usr = document.getElementById('rcv_usr'),
        isu_date = document.getElementById('isu_date'),
        isu_mdl = document.getElementById('isu_mdl');

    let row_len = 0,
        rows = {};

    display_model();

    function display_model() {
        row_len = isu_tbl.rows.length;
        rows = isu_tbl.rows;

        if (row_len < 2) {
            alert('No items selected!');
        } else if (isu_date.value === '') {
            alert('Please fill the required fields!');
        }
        else {
            let ad_mdl_cont =
                `<div id="isu_mdl_cont" class="mdl_cont">
                <span id="isu_mdl_close" class="mdl_close">&times</span>
                <div>
                    <div>Issue Note</div>                    
                    <div>Issued Station: (need to find)</div>
                    <div>Received Station: ${ rcv_stn.options[rcv_stn.selectedIndex].text }</div>
                    <div>Issued to: ${ rcv_usr.options[rcv_usr.selectedIndex].text }</div>
                    <div>
                        <table id="ad_mdl_tbl">
                            <thead>
                                <tr>
                                    <th>Description of Stores</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody id="isu_mt_bd">`;

            let md_tbl_rows = ``;
            for (let i = 1; i < row_len; i++) {

                md_tbl_rows += `
                    <tr> 
                       <td>${rows[i].querySelector("td[data-cell='name']").innerText}</td>
                       <td>${rows[i].querySelector("td[data-cell='quantity']").innerText}</td>                                
                    </tr>`;
            }

            ad_mdl_cont += `${ md_tbl_rows }</tbody>
                        </table>
                    </div>
                </div>
                <div class="clearfix">
                    <p>Issued on ${ isu_date.value } and the issue duly entered.</p>
                    <br>
                    <div>................................</div>
                    <div>(name of the officer)</div>
                    <div>Issuing Officer</div>
                    <button id="isu_conf_btn" type="button" class="add_btn mdl_conf_btn">Confirm</button>
                </div>
            </div>`;

            isu_mdl.innerHTML = ad_mdl_cont;

            isu_mdl.querySelector('#isu_conf_btn').addEventListener('click', submit_issue);
            isu_mdl.querySelector('#isu_mdl_close').addEventListener('click', function() {
                isu_mdl.style.display = 'none';
            });
            isu_mdl.style.display = 'block';
        }
    }

    /**
     * submit issue & reset form with updated data
     */
    function submit_issue() {
        if (row_len < 2) {
            alert('No items selected!');
        } else if (isu_date.value === '') {
            alert('Please fill the required fields!');
        } else {
            display_loading();
            const isu_list = {};
            isu_list.items = [];
            let rows = isu_tbl.rows;
            for (let m = 1; m < row_len; m++) {
                isu_list.items.push({
                    'item_id': rows[m].querySelector("td[data-cell='name']").getAttribute('data-item-id'),
                    'quantity': rows[m].querySelector("td[data-cell='quantity']").innerHTML,
                });
            }
            isu_list.details = {
                'rcv_stn': rcv_stn.value,
                'rcv_usr': rcv_usr.value,
                'isu_date': isu_date.value,
            };
            console.log('data sending');

            const XHR = new XMLHttpRequest();

            XHR.addEventListener('load', function(event) {
                console.log('issue response loaded');

                const res_obj = JSON.parse(event.target.response);
                console.log(res_obj.msg);

                reset_form(res_obj.items);
                display_success();
            });
            XHR.addEventListener('abort', function(event) {
                console.log('request aborted' + event.target.responseText);
            });
            XHR.addEventListener('error', function(event) {
                console.log('something went wrong' + event.target.responseText);
            });
            XHR.open('POST', '/issue_items', true);
            XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            // eslint-disable-next-line no-undef
            XHR.send('_token=' + getCSRF() + '&' + 'issue=' + JSON.stringify(isu_list));
        }

        function reset_form(items) {
            try {
                let i = row_len - 1;
                for (i; i > 0; i--) {
                    rows[i].remove();
                }
                isu_date.value = '';
                document.getElementById('itm_tbl_bd').innerHTML = '';
                set_item_table(items);
                console.log('isu form resets successfully');
            } catch (e) {
                console.log('error occurred while resetting the isu form' + e);
            }
        }

        function display_loading() {
            const mdl_cont = isu_mdl.querySelector('#isu_mdl_cont');
            mdl_cont.innerHTML = `<p>processing request please wait...</p>`;
        }

        function display_success() {
            const mdl_cont = isu_mdl.querySelector('#isu_mdl_cont');
            mdl_cont.innerHTML = `<span id="ad_mdl_close" class="mdl_close">&times;</span>
                    <p>Items added successfully:)</p>`;
            mdl_cont.querySelector('#ad_mdl_close').addEventListener('click', function() {
                isu_mdl.style.display = 'none';
            });
        }
    }
}
