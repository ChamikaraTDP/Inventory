import { make_list, get_parent, tog_row_disp } from './helpers/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { cloneDeep } from 'lodash';

export { init_isu_tab, display_model, create_pdf };


/**
 * Initialize the issue tab
 *
 * @param {array} avl_itms      All available items in current station as objects
 *
 * @use set_item_table()
 * @use set_isu_list()
 * @use #isu_sub_btn
 */
function init_isu_tab(avl_itms) {
    set_item_table(avl_itms); // set middle item list
    set_isu_list(); // issue list setup
    document.getElementById('isu_sub_btn').addEventListener('click', handle_submit);
}


// --------------------------------------- init_isu_tab helpers -----------------------------------------------
/**
 * Initialize the available items table in issue tab
 *
 * @param {array} avl_itms      All available items in current station as objects
 *
 * @use #itm_tbl_bd
 * @use disp_fil_list()
 * @use itm_to_isu()
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

        cat = ( window.get_categories() ).find(function(gcat) {
            return gcat.id === item.category_id;
        });

        cell1.innerHTML = cat.name;
        cell1.setAttribute('data-cell', 'category');

        cell2.innerHTML = item.name;
        cell2.setAttribute('data-item-id', item.item_id);
        cell2.setAttribute('data-cell', 'name');

        cell3.innerHTML = item.quantity;
        cell3.setAttribute('data-cell', 'available');

        cell4.innerHTML = `
            <input class='input_number max_width_short' type='number' min='1' max='${ item.quantity }'
                name="isu_qt"/>`;

        const quan_input = cell4.querySelector("input[name='isu_qt']");

        // inventory items
        if(item.type) {
            cell5.innerHTML = `
             <button id='fil_btn_${ item.item_id }' class='button is-small is-info is-outlined' type='button'
                name="isu_fil_btn">
                  Fill
             </button>
              
             <button id='isu_drop_btn_${ item.item_id }' style="display: none" class='button is-small'
               type='button' name="inv_drop_btn">
                  <span class="icon is-small">
                       <i class="fas fa-chevron-down"></i>
                  </span>
             </button>
             
             <button  id='add_all_btn_${ item.item_id }' style="display: none"
                class='button is-small is-info is-outlined' type='button' name="add_all_btn">
                  <span class="icon is-small">
                      <i class="fas fa-share-square"></i>
                  </span>
              </button>
              
             <button  id='rmv_all_btn_${ item.item_id }' style="display: none"
                class='button is-small is-danger is-outlined' type='button' name="rmv_all_btn">
                    <span class="icon is-small">
                        <i class="fas fa-trash-alt"></i>
                    </span>
             </button>`;

            const isu_fil_btn = cell5.querySelector("button[name='isu_fil_btn']");

            isu_fil_btn.addEventListener('click', function() {
                disp_fil_list(this);
            });

            quan_input.addEventListener('keyup', function(event) {
                if(event.keyCode === 13) {
                    isu_fil_btn.click();
                }
            });

        }
        else {     // bulk items
            cell5.innerHTML = `
                <button id='isu_ad_btn_${ item.item_id }' class='button is-small'
                 type='button' name="isu_ad_btn">
                    <span class="icon is-small">
                        <i class="fas fa-arrow-right"></i>
                    </span>
                </button>`;

            const isu_ad_btn = cell5.querySelector("button[name='isu_ad_btn']");

            isu_ad_btn.addEventListener('click', function() {
                itm_to_isu(this);
            });

            quan_input.addEventListener('keyup', function(event) {
                if(event.keyCode === 13) {
                    isu_ad_btn.click();
                }
            });
        }

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(cell5);

        tbl_bd.appendChild(row);
    }
}


/**
 * Create receiving station & receiving officer dropdowns
 *
 * @use make_list()
 * @use make_usr_list()
 */
function set_isu_list() {
    const stations = ( window.get_stations() ).filter(function(station) {
            return window.get_user().station_id !== station.id;
        }),
        list = make_list(stations),
        stn_drp_dv = document.getElementById('rcv_stn_dv');


    stn_drp_dv.innerHTML = `
        <label for='rcv_stn' class="label_float width_10">Receiving Station</label>
        <span class="float_left padding_right_5">:</span>
        <div class="select is-small input_float">
            <select id='rcv_stn' style="font-size: var(--select-dropdown-font-size)" name='rcv_stn'>
                ${ list }
            </select>
        </div>`;

    const rcv_stn = document.getElementById('rcv_stn');

    rcv_stn.addEventListener('change', (event) => {
        make_usr_list(event.target.value);
    });

    make_usr_list(rcv_stn.value);
}


// --------------------------------------- set_item_table helpers ---------------------------------------------
/**
 * Display inventory items filling form
 *
 * @param {HTMLButtonElement} node      isu_fil_btn
 *
 * @use append_divs
 * @use toggle_btns
 */
function disp_fil_list(node) {
    const prn_row = get_parent(node, 'TR'),
        isu_qt = Number(prn_row.querySelector("input[name='isu_qt']").value),
        av_qt = Number( prn_row.querySelector("td[data-cell='available']").innerText );

    if (isu_qt > av_qt || isu_qt < 1) {
        alert('invalid quantity!');
    }
    else  {
        const row = document.createElement('TR'),
            cell = document.createElement('TD');

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
}


/**
 * add **bulk** items to issuing list
 *
 * @param {HTMLButtonElement} node     bulk item add btn
 *
 * @use itm_fm_isu
 */
function itm_to_isu(node) {
    let prn_row = get_parent(node, 'TR'),
        isu_node = prn_row.querySelector("input[name='isu_qt']"),
        isu_qt = Number(isu_node.value),
        av_qt = Number(prn_row.querySelector("td[data-cell='available']").innerText);

    // validation
    if (isu_qt > av_qt || isu_qt < 1) {
        alert('invalid input');
    }
    else {
        const row = document.createElement('TR'),
            cell2 = document.createElement('TD'),
            cell3 = document.createElement('TD');
        let cell1 = prn_row.querySelector("td[data-cell='name']");

        row.setAttribute('data-item-type', '0');
        cell1 = cell1.cloneNode(true);

        cell2.innerHTML = String(isu_qt);
        cell2.setAttribute('data-cell', 'quantity');

        cell3.innerHTML = `
            <button class='button is-small is-danger is-outlined' type='button' name="isu_rm_btn">
                <span class="icon is-small">
                    <i class="fas fa-times"></i>
                </span>
            </button>`;

        cell3.querySelector("button[name='isu_rm_btn']").addEventListener('click',
            function() {
                const ad_btn_id = 'isu_ad_btn_' + cell1.getAttribute('data-item-id');
                itm_fm_isu(this, ad_btn_id);
            }
        );

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);

        document.getElementById('isu_tbl_bd').appendChild(row);

        node.disabled = true;
        isu_node.disabled = true;
    }
}


// --------------------------------------- set_isu_list helpers ---------------------------------------------
/**
 * make the user dropdown
 *
 * @param {number} stn_id       id of the current station
 */
function make_usr_list(stn_id) {
    const stn_users = ( window.get_users() ).filter( function (usr) {
        return usr.station_id == stn_id;
    });

    const list = make_list(stn_users);
    document.getElementById('rcv_usr_dv').innerHTML = `
            <label for='rcv_usr' class="label_float width_10">Receiving Officer</label>
            <span class="float_left padding_right_5">:</span>
            <div class="select is-small input_float">
                <select id='rcv_usr' style="font-size: var(--select-dropdown-font-size)" name='rcv_usr'>
                    ${ list }
                </select>
            </div>`;
}


// --------------------------------------- disp_fil_list helpers --------------------------------------------
/**
 * Append num of divs containing inventory item inputs to a given cell
 *
 * @param {HTMLElement} cell       to where the divs added
 * @param {number} num      number of divs should be added
 * @param {HTMLTableRowElement} prn_row     corresponding parent row of the item
 * @use inv_to_isu()
 * @use rm_function()
 * @use add_div()
 */
function append_divs(cell, num, prn_row) {
    let div = {};

    for (let i = 0; i < num; i++) {
        div = document.createElement('DIV');
        div.classList.add('field', 'is-grouped');
        div.innerHTML = `
            <span class="inline_block control">
                <input id="" class='form_input' type='text' name='itm_code' placeholder="Item Code">
            </span>
            <span class="inline_block control">
                <input class='form_input' type='text' name='serial_no' placeholder="Serial Number">
            </span>
            <span class="inline_block control">
                <button class='button is-small is-outlined' type='button' name="inv_ad_btn">
                    <span class="icon is-small"><i class="fas fa-arrow-right"></i></span>
                </button>
            </span>
            <span class="inline_block control">
                <button class='button is-small is-danger is-outlined' type='button'
                   name="inv_itm_rm_btn">
                    <span class="icon is-small"><i class="fas fa-minus"></i></span>
                 </button>
            </span>
            <span class="inline_block control">
                <button style="display: none" class='button is-small is-info is-outlined' type='button'
                  name="inv_itm_ad_btn">
                    <span class="icon is-small"><i class="fas fa-plus"></i></span>
                </button>
            </span>`;

        div.querySelector("button[name='inv_ad_btn']")
            .addEventListener('click', function() {
                inv_to_isu(this, prn_row);
            });

        div.querySelector("button[name='inv_itm_rm_btn']")
            .addEventListener('click', function() {
                rm_function(this, prn_row, cell);
            });

        div.querySelector("button[name='inv_itm_ad_btn']").
            addEventListener('click', function() {
                add_div(this, cell, prn_row );
            });

        cell.appendChild(div);
    }
}


/**
 *  Button toggling after fill button clicked
 *
 * @param {HTMLTableRowElement} row     containing the inventory item filling list
 * @param {HTMLTableRowElement} prn_row     corresponding parent row of the item
 * @use remove_row()
 * @use tog_row_disp()
 * @use add_all_itms()
 */
function toggle_btns(row, prn_row) {
    const isu_node = prn_row.querySelector("input[name='isu_qt']"),
        drop = prn_row.querySelector("button[name='inv_drop_btn']"),
        rmv_all = prn_row.querySelector("button[name='rmv_all_btn']"),
        fil_btn = prn_row.querySelector("button[name='isu_fil_btn']"),
        add_all = prn_row.querySelector("button[name='add_all_btn']");

    rmv_all.addEventListener('click', function() {
        remove_row(row, prn_row);
    });

    drop.addEventListener('click', function() {
        tog_row_disp(row);
    });

    add_all.addEventListener('click', function() {
        add_all_itms(row, prn_row);
    });

    isu_node.disabled = true;
    fil_btn.style.display = 'none';
    drop.style.display = 'inline-block';
    add_all.style.display = 'inline-block';
    rmv_all.style.display = 'inline-block';
}


// --------------------------------------- itm_to_isu helpers --------------------------------------------
/**
 * remove rows form issuing list
 *
 * @param {HTMLButtonElement} node      remove btn in issue list
 * @param {string} ad_btn       id of the add btn who made this row
 *
 * @use get_parent()
 */
function itm_fm_isu(node, ad_btn) {
    get_parent(node, 'TR').remove();

    ad_btn = document.getElementById(ad_btn);
    ad_btn.disabled = false;

    let prn_row = get_parent(ad_btn, 'TR');
    prn_row.querySelector("input[name='isu_qt']").disabled = false;
}


/**
 * add **inventory** items to the issuing list
 *
 * @param {HTMLButtonElement} ad_btn
 * @param prn_row
 * @returns {boolean}
 */
function inv_to_isu(ad_btn, prn_row) {
    const info_div = get_parent(ad_btn, 'DIV'),
        item_inp = info_div.querySelector("input[name='itm_code']"),
        item_code = item_inp.value,
        seri_inp = info_div.querySelector("input[name='serial_no']"),
        serial = seri_inp.value;

    // validation
    if(item_code === '' && serial === '') {
        alert('You must fill Item code or Serial number!');
        return false;
    }

    ad_btn.disabled = true;
    const rm_btn = info_div.querySelector("button[name='inv_itm_rm_btn']");
    rm_btn.disabled = true;
    item_inp.disabled = true;
    seri_inp.disabled = true;
    ad_btn.classList.toggle('is-active');
    rm_btn.classList.toggle('is-active');

    const rm_all = prn_row.querySelector("button[name='rmv_all_btn']");

    let cell1 = prn_row.querySelector("td[data-cell='name']");
    const itm_id = cell1.getAttribute('data-item-id');
    let itm_row = document.getElementById('inv_itm_' + itm_id);

    const div = document.createElement('DIV');
    div.setAttribute('data-row', 'info');
    div.classList.add('padded_ruler');

    div.innerHTML = `
        <span class="width_40" data-cell="code">${ item_code }</span>
        <span class="width_40" data-cell="serial">${ serial }</span>
        <button class="button is-small is-danger is-outlined" type="button" name="inv_itm_rm_btn">
            <span class="icon is-small">
                <i class="fas fa-times"></i>
            </span>
        </button>`;

    div.querySelector("button[name='inv_itm_rm_btn']")
        .addEventListener('click', function() {
            const qun_node = itm_row.querySelector("td[data-cell='quantity']");
            const qun = Number(qun_node.innerText) - 1;

            if(qun === 0) {
                itm_row.nextElementSibling.remove();
                itm_row.remove();

                //rm_all.setAttribute('class', 'rm_btn isu_ad_btn');
                rm_all.disabled = false;
            }
            else {
                div.remove();
                qun_node.innerText = qun;
            }

            ad_btn.disabled = false;
            rm_btn.disabled = false;
            item_inp.disabled = false;
            seri_inp.disabled = false;
            //ad_btn.setAttribute('class', 'add_btn isu_ad_btn');
            //rm_btn.setAttribute('class', 'rm_btn isu_ad_btn');

        });

    if(itm_row) {
        const cell = itm_row.nextElementSibling.firstChild;
        cell.appendChild(div);
        const qun_node = itm_row.querySelector("td[data-cell='quantity']");
        qun_node.innerText = Number(qun_node.innerText) + 1;
    }
    else {
        rm_all.disabled = true;

        itm_row = document.createElement('TR');
        const cell2 = document.createElement('TD'),
            cell3 = document.createElement('TD');

        itm_row.setAttribute('id', 'inv_itm_' + itm_id);
        itm_row.setAttribute('data-item-type', '1');
        cell1 = cell1.cloneNode(true);
        cell2.innerHTML = '1';
        cell2.setAttribute('data-cell', 'quantity');
        cell3.innerHTML = `
            <button class="button is-small" type="button" name="isu_tog_btn">
                <span class="icon is-small">
                    <i class="fas fa-chevron-down"></i>
                </span>
            </button>
            <button class="button is-small is-danger is-outlined" type="button" name="rmv_all_btn">
                <span class="icon is-small">
                    <i class="fas fa-trash-alt"></i>
                </span>
            </button>`;

        itm_row.appendChild(cell1);
        itm_row.appendChild(cell2);
        itm_row.appendChild(cell3);

        const code_row = document.createElement('TR'),
            cell = document.createElement('TD'),
            labl_div = document.createElement('DIV');

        labl_div.setAttribute('data-row', 'desc');
        labl_div.innerHTML = '<span class="width_40">Item Code</span>' +
            '<span class="width_40">Serial Number</span>';

        cell.setAttribute('colspan', '3');
        cell.appendChild(labl_div);
        cell.appendChild(div);
        code_row.appendChild(cell);

        cell3.querySelector("button[name='isu_tog_btn']")
        .addEventListener('click', function (){
            tog_row_disp(code_row);
        });

        cell3.querySelector("button[name='rmv_all_btn']")
        .addEventListener('click', function() {
            const rm_btns = code_row.querySelectorAll("button[name='inv_itm_rm_btn']");

            for (let btn of rm_btns) {
                btn.click();
            }
        });

        document.getElementById('isu_tbl_bd').appendChild(itm_row);
        itm_row.insertAdjacentElement('afterend', code_row);
    }

    return true;
}


function rm_function(rm_btn, prn_row, cell) {
    const cur_div = get_parent(rm_btn, 'DIV');
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

    let drp_clone = drp.cloneNode(true);
    let rmv_clone = rmv.cloneNode(true);

    drp.parentNode.replaceChild(drp_clone, drp);
    rmv.parentNode.replaceChild(rmv_clone, rmv);

    drp_clone.style.display = 'none';
    rmv_clone.style.display = 'none';
    add.style.display = 'none';
    fil.style.display = 'inline-block';
    isu.disabled = false;

    row.remove();
}


/**
 * add all item details to the list
 *
 * @param
 * */
function add_all_itms(row, prn_row) {
    const add_btns = row.firstChild.querySelectorAll("button[name='inv_ad_btn']:enabled");

    for(let btn of add_btns) {
        if( !inv_to_isu(btn, prn_row) ) {
            break;
        }
    }
}

/**
 *  organize the data from the list
 *
 * @returns {Object}
 */
function process_data() {
    const isu_tbl = document.getElementById('isu_lst_tbl'),
        rcv_stn = document.getElementById('rcv_stn'),
        rcv_usr = document.getElementById('rcv_usr'),
        isu_date = document.getElementById('isu_date'),
        rows = isu_tbl.rows,
        row_len = rows.length;

    if (row_len < 2) {
        alert('No items selected!');
        throw Error('issuing table does not contain any items!');
    }
    else if (isu_date.value === '') {
        alert('Please fill the required fields!');
        throw Error('required fields are not filled');
    }

    const isu_list = {
        'items': {
            'bulk': [],
            'inv': [],
        },

        'details': {},

        'model_details': {
            'heading': `Issue Note`,
            'top_left': {
                'Issued Station':  window.get_user_station().name,
                'Received Station': rcv_stn.options[rcv_stn.selectedIndex].text,
                'Received Officer': rcv_usr.options[rcv_usr.selectedIndex].text,
            },
            'top_right': {},
            'bottom_left': {
                'Issued on': `Issued on ${ isu_date.value } and the issue duly entered.`,
            },
            'sign_det': {
                'dots': '.............................................',
                'sign_usr_name' : window.get_user().name,
                'sign_note': `(Issuing Officer)`,
            },
            'btn_text' : `Confirm`,
        }
    };

    for (let m = 1; m < row_len; m++) {

        if( rows[m].getAttribute('data-item-type') ===  '1') {

            let inv_itm = {
                'name': rows[m].querySelector("td[data-cell='name']").innerText,
                'item_id': rows[m].querySelector(
                    "td[data-cell='name']").getAttribute('data-item-id'),
                'quantity': rows[m].querySelector("td[data-cell='quantity']").innerText,
                'codes': [],
            };

            m++;

            let code_divs = rows[m].querySelectorAll("div[data-row='info']");
            let div_count = code_divs.length;

            for(let j = 0; j < div_count; j++) {
                inv_itm.codes.push(
                    {
                        'code': code_divs[j].querySelector("span[data-cell='code']").innerText,
                        'serial': code_divs[j].querySelector("span[data-cell='serial']").innerText,
                    }
                );
            }

            isu_list.items.inv.push(inv_itm);
        }
        else {
            isu_list.items.bulk.push(
                {
                    'name': rows[m].querySelector("td[data-cell='name']").innerText,
                    'item_id': rows[m].querySelector(
                        "td[data-cell='name']").getAttribute('data-item-id'),
                    'quantity': rows[m].querySelector("td[data-cell='quantity']").innerText,
                }
            );
        }
    }

    isu_list.details = {
        rcv_stn: rcv_stn.value,
        rcv_usr: rcv_usr.value,
        isu_date: isu_date.value,
        isu_stn: window.get_user_station().id,
        isu_usr: window.get_user().id,
    };

    console.log(isu_list);

    return isu_list;
}


function handle_submit() {
    const isu_mdl = document.getElementById('isu_mdl');
    let isu_list = {};

    try {
        isu_list = process_data();
    }
    catch (err) {
        console.log('error occurred while processing data ' + err);
        return;
    }

    display_model(isu_mdl, isu_list, submit_issue);
    //create_pdf(isu_list);
}


function display_model(isu_mdl, isu_list, button_func) {
    const inv_len = isu_list.items.inv.length,
        bulk_len =  isu_list.items.bulk.length,
        model_details = isu_list.model_details;

    let isu_mdl_cont =
        `<div id="isu_mdl_cont" class="mdl_cont">
            <span id="isu_mdl_close" class="mdl_close">&times</span>
            <div>
                <div style="text-align:center; font-size:1.1rem">
                    <strong>${ model_details.heading }</strong>
                </div>`;

    if( model_details.top_right.tran_det ) {
        isu_mdl_cont += `<div>${ model_details.top_right.tran_det }</div>`;
    }

    let top_left = model_details.top_left;

    for(let key in top_left) {
        isu_mdl_cont += `<div><span>${key}</span> : <span>${top_left[key]}</span></div>`;
    }

    isu_mdl_cont += `
        <br>
            <div>
                <table id="isu_mdl_tbl" class="mdl_table">
                    <thead>
                        <tr>
                            <th>Description of Stores</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody id="isu_mt_bd">`;

    let md_tbl_rows = ``,
        quan = 0,
        items = isu_list.items.inv;

    for(let n = 0; n < inv_len; n++) {
        quan = items[n].quantity;
        md_tbl_rows += `
            <tr> 
               <td>${ items[n].name }</td>
               <td>${ quan }</td>                                
            </tr>
            <tr>
                <td colspan="2">
                    <div>
                      <span class="width_40">Item Code</span>
                      <span class="width_40">Serial Number</span>
                    </div>`;

        for(let m = 0; m < quan; m++) {
            md_tbl_rows += `
                <div>
                    <span class="width_40">
                        ${ items[n].codes[m].code }
                    </span>
                    <span class="width_40">
                        ${ items[n].codes[m].serial }
                    </span>
                </div>`;
        }

        md_tbl_rows += `</td></tr>`;
    }

    items = isu_list.items.bulk;

    for(let j = 0; j < bulk_len; j++) {
        md_tbl_rows += `
            <tr> 
               <td>${ items[j].name }</td>
               <td>${ items[j].quantity }</td>                                
            </tr>`;
    }

    isu_mdl_cont += `        ${ md_tbl_rows }
                        </tbody>
                    </table>
                </div>
            </div>
            <br>
            <div class="clearfix">`;

    let bot_lef = model_details.bottom_left;

    for(let key in bot_lef) {
        isu_mdl_cont +=`<div>${ bot_lef[key] }</div>`;
    }

    isu_mdl_cont  +=  `<br>`;

    let  sign_det = model_details.sign_det;
    for(let key in sign_det) {
        isu_mdl_cont += `<div>${sign_det[key]}</div>`;
    }

    isu_mdl_cont += `<button id="isu_conf_btn" type="button" class="button is-link is-outlined mdl_conf_btn">
                    ${ model_details.btn_text }
                </button>
            </div>
        </div>`;

    isu_mdl.innerHTML = isu_mdl_cont;

    isu_mdl.querySelector('#isu_conf_btn').addEventListener('click', function(){
        button_func(isu_mdl, isu_list);
    });

    isu_mdl.querySelector('#isu_mdl_close').addEventListener('click', function() {
        isu_mdl.style.display = 'none';
    });

    isu_mdl.style.display = 'block';

}

/**
 * Generate pdf documents
 *
 * @param isu_list
 */
function create_pdf(isu_list) {
    const pageWidth = 8.3, // inches
        lineHeight = 1.2,
        margin = 0.5,
        maxLineWidth = pageWidth - margin * 2,
        fontSize = 12, // points
        ptsPerInch = 72,
        oneLineHeight = (fontSize * lineHeight) / ptsPerInch, // lineHeight times fontSize(in inches)
        inv_itms = isu_list.items.inv,
        inv_len = inv_itms.length,
        model_det = isu_list.model_details,
        doc = new jsPDF({
            unit: "in",
            lineHeight: lineHeight,
        });

    // font styles for heading
    doc.setFontStyle("bold")
        .setFont("helvetica", "neue")
        .setFontSize(fontSize);

    // y coordinate of lines
    let  ymi = 1;

    // heading
    doc.text(
        `${ model_det.heading }`,
        pageWidth / 2,
        margin + ymi * oneLineHeight,
        { align: "center" }
    );

    // font styles for content
    doc.setFontStyle("normal");

    ymi += 2;
    let ymi_r = ymi;

    // draw top-left content
    const top_left = model_det.top_left;

    for(let prop in top_left) {
        doc.text(`${ prop } : ${ top_left[prop] }`, margin, margin + ymi * oneLineHeight);
        ymi++;
    }

    // draw top-right content
    const top_right = model_det.top_right;

    for(let prop in top_right ) {
        doc.text(`${ top_right[prop] }`, maxLineWidth + margin, margin + ymi_r * oneLineHeight,
            { align: 'right'});
        ymi_r++;
    }

    ymi = Math.max(ymi, ymi_r);
    //ymi++;

    // draw item details
    doc.autoTable({
        startY: margin + ymi * oneLineHeight,
        margin: 0.5,
        head: [ ['Description of Stores', 'Quantity'] ],
        body: data(isu_list, oneLineHeight),
        tableLineColor: 0,
        tableLineWidth: 0.01,
        styles: {
            lineColor: 0,
            lineWidth: 0.01,
            font: 'times',
            fontSize: fontSize,
            textColor: 10,
        },
        headStyles: {
            fillColor: 210,
        },
        didDrawCell: function (data) {

            if (data.row.section === 'body' && data.row.index < inv_len * 2  && data.row.index % 2 !== 0) {
                let itm_in = Math.floor(data.row.index / 2);
                let codes = inv_itms[itm_in].codes;
                let code_len = codes.length;

                doc.text(
                    `Item code`,
                    data.cell.x + 1,
                    data.cell.y + oneLineHeight
                );

                doc.text(
                    `Serial Number`,
                    data.cell.x + 3.5,
                    data.cell.y + oneLineHeight
                );

                for (let i = 0; i < code_len; i++) {
                    doc.text(
                        `${ codes[i].code }`,
                        data.cell.x + 1,
                        data.cell.y + (i + 2) * oneLineHeight
                    );

                    doc.text(
                        `${ codes[i].serial }`,
                        data.cell.x + 3.5,
                        data.cell.y + (i + 2) * oneLineHeight
                    );
                }
            }
        },
    });

    const finalY = doc.previousAutoTable.finalY;

    // draw bottom note area
    const bottom = model_det.bottom_left;
    ymi = 2;

    for (let prop in bottom) {
        doc.text(`${ bottom[prop] }`, margin, finalY + ymi * oneLineHeight);
        ymi++;
    }

    // draw sign details
    const sign_det = model_det.sign_det;
    ymi += 3;

    for (let prop in sign_det) {
        doc.text(`${ sign_det[prop] }`, margin, finalY + ymi * oneLineHeight);
        ymi++;
    }

    doc.save('test.pdf');
}


function data(list, line_height) {
    let body = [];
    items = list.items.inv;
    rowCount = items.length;

    for (let j = 0; j < rowCount; j++){
        body.push([
            items[j].name,
            items[j].quantity
        ]);
        body.push([
            {
                content: '',
                colSpan: 2,
                styles: {
                    minCellHeight: ( (Number(items[j].quantity) + 2) * line_height ),
                    halign: 'center',
                    valign: 'center',
                    fillColor: 230,
                },
            },
        ]);
    }

    let items = list.items.bulk;
    let rowCount = items.length;

    for (let j = 0; j < rowCount; j++) {
        body.push([
            items[j].name,
            items[j].quantity
        ]);
    }

    return body;
}


/**
 * submit issue & reset form with updated data
 */
function submit_issue(isu_mdl, isu_list ) {
    display_loading(isu_mdl);

    const pdf_list = cloneDeep(isu_list);
    delete isu_list.model_details;

    const rows = document.getElementById('isu_lst_tbl').rows;
    console.log('data sending');

    const XHR = new XMLHttpRequest();

    XHR.addEventListener('load', function(event) {
        if(event.target.status === 200) {
            console.log('issue response loaded');

            const res_obj = JSON.parse(event.target.response);
            console.log(res_obj.msg);

            reset_form(res_obj.items, rows);
            pdf_list.model_details.top_right.tran_det = `Transaction ID: ${ res_obj.t_id }`;
            display_success(isu_mdl, pdf_list);
        }
        else {
            console.log('Error occurred while submitting the data!');
            throw Error('submission not successful!');
        }
    });
    XHR.addEventListener('abort', function(event) {
        console.log('request aborted' + event.target.responseText);
    });
    XHR.addEventListener('error', function(event) {
        console.log('something went wrong' + event.target.responseText);
    });
    XHR.open('POST', '/inventory/transaction/stock/issue', true);
    XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    XHR.send('_token=' + window.getCSRF() + '&' + 'issue=' + JSON.stringify(isu_list));
}


function reset_form(items, rows) {

    try {
        let i = rows.length - 1;

        for (i; i > 0; i--) {
            rows[i].remove();
        }

        document.getElementById('itm_tbl_bd').innerHTML = '';

        set_item_table(items);

        console.log('isu form resets successfully');
    }
    catch (e) {
        console.log('error occurred while resetting the isu form' + e);
    }
}


function display_loading(isu_mdl) {
    const mdl_cont = isu_mdl.querySelector('#isu_mdl_cont');
    mdl_cont.innerHTML = `<p>processing request please wait...</p>`;
}


function display_success(isu_mdl, pdf_list) {
    const mdl_cont = isu_mdl.querySelector('#isu_mdl_cont');

    mdl_cont.innerHTML = `<span id="ad_mdl_close" class="mdl_close">&times;</span>
        <p>Issue successful :)</p><button class="add_btn isu_ad_btn" type="button">Download PDF</button>`;

    mdl_cont.querySelector('#ad_mdl_close').addEventListener('click', function() {
        isu_mdl.style.display = 'none';
    });

    mdl_cont.querySelector('button').addEventListener('click', function() {
        create_pdf(pdf_list);
    });

}
