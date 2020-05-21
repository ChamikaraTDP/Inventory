import {
    display_model,
    set_isu_list,
    display_loading,
    display_success,
    reset_form,
} from './issue_tab';
import { tog_row_disp } from './helpers/utils';
import { get_parent } from './helpers/utils';
import { cloneDeep } from 'lodash';


export { init_isu_tab };

/**
 * Initialize the issue tab
 *
 * @param {array} avl_itms      All available items in current station as objects
 *
 */
function init_isu_tab(avl_itms) {
    set_isu_table(avl_itms); // set middle item list
    set_isu_list(); // issue list setup
    document.getElementById('isu_sub_btn').addEventListener('click', handle_submit);
}


function set_isu_table(avl_itms) {
    const tbl_bd = document.getElementById('itm_tbl_bd');

    let row = {}, cell1 = {}, cell2 = {}, cell3 = {},cell4 = {}, cell5 = {}, cat = {}, item = {},
        inv_drop_btn = {}, cell_c = {};

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
        cell1.dataset.cell = 'category';

        cell2.innerHTML = item.name;
        cell2.dataset.itemId = item.item_id;
        cell2.dataset.cell = 'name';

        cell3.innerHTML = item.quantity;
        cell3.dataset.cell = 'available';

        cell4.innerHTML = `
            <input style="background-color: white"
                class='input_number max_width_short'
                type='number' min='1' max='${ item.quantity }'
                name="isu_qt" disabled/>`;

        cell5.innerHTML = `            
             <button id='isu_drop_btn_${ item.item_id }' class='button is-small'
               type='button' name="inv_drop_btn">
                 <span class="icon is-small">
                     <i class="fas fa-chevron-down"></i>
                 </span>
             </button>`;

        inv_drop_btn = cell5.querySelector("button[name='inv_drop_btn']");

        let row_c = document.createElement('TR');
        cell_c = document.createElement('TD');

        cell_c.setAttribute('colspan', '5');

        append_divs(cell_c, item.codes, row);

        row_c.appendChild(cell_c);
        row_c.style.display = 'none';

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(cell5);

        tbl_bd.appendChild(row);
        row.insertAdjacentElement('afterend', row_c);

        inv_drop_btn.addEventListener('click', function() {
            tog_row_disp(row_c);
        });
    }
}


function append_divs(cell, items, prn_row) {
    let div = document.createElement('DIV');
    div.classList.add('field', 'is-grouped');
    div.innerHTML = `
            <span style="width: 16rem" class="inline_block control">
                <span>Item Code</span>
            </span>
            <span class="inline_block control">
                <span>Serial Number</span>
            </span>`;

    cell.appendChild(div);

    for (let inst of items) {
        div = document.createElement('DIV');
        div.classList.add('field', 'is-grouped');
        div.dataset.invItemId = inst.id;
        div.innerHTML = `
            <span style="width: 16rem" class="inline_block control">
                <input style="background-color: white; color: rgb(54, 54, 54);"
                    class='form_input'
                    type='text' name='itm_code' value="${ inst.code }" placeholder="Item Code" disabled>
            </span>
            <span class="inline_block control">
                <input style="background-color: white; color: rgb(54, 54, 54)" class='form_input'
                 type='text' name='serial_no' value="${ inst.serial }" placeholder="Serial Number" disabled>
            </span>
            <span class="inline_block control">
                <button class='button is-small is-outlined' type='button' name="inv_ad_btn">
                    <span class="icon is-small"><i class="fas fa-arrow-right"></i></span>
                </button>
            </span>`;


        div.querySelector("button[name='inv_ad_btn']")
            .addEventListener('click', function() {
                inv_to_isu(this, prn_row);
            });

        /*
                div.querySelector("button[name='inv_itm_rm_btn']")
                    .addEventListener('click', function() {
                        rm_function(this, prn_row, cell);
                    });

                div.querySelector("button[name='inv_itm_ad_btn']").
                    addEventListener('click', function() {
                        add_div(this, cell, prn_row );
                    });*/

        cell.appendChild(div);
    }
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
    ad_btn.classList.toggle('is-active');

    let cell1 = prn_row.querySelector("td[data-cell='name']");
    const itm_id = cell1.dataset.itemId;
    let itm_row = document.getElementById('inv_itm_' + itm_id);

    const div = document.createElement('DIV');
    div.dataset.row = 'info';
    div.dataset.invItemId = info_div.dataset.invItemId;
    div.classList.add('padded_ruler');

    div.innerHTML = `
        <span class="width_40" data-cell="code">${ item_code }</span>
        <span class="width_40" data-cell="serial">${ serial }</span>
        <button class="button is-small is-danger is-outlined" type="button" name="inv_itm_rm_btn">
            <span class="icon is-small">
                <i class="fas fa-times"></i>
            </span>
        </button>`;

    const qt_node = prn_row.querySelector("input[name='isu_qt']");

    div.querySelector("button[name='inv_itm_rm_btn']")
        .addEventListener('click', function() {
            const qun_node = itm_row.querySelector("td[data-cell='quantity']");
            const qun = Number(qun_node.innerText) - 1;

            if(qun === 0) {
                itm_row.nextElementSibling.remove();
                itm_row.remove();
                qt_node.value =  '';
            }
            else {
                div.remove();
                qun_node.innerText = qun;
                qt_node.value =  Number(qt_node.value) - 1;
            }

            ad_btn.disabled = false;
            ad_btn.classList.toggle('is-active');

        });

    if(itm_row) {
        const cell = itm_row.nextElementSibling.firstChild;
        cell.appendChild(div);
        const qun_node = itm_row.querySelector("td[data-cell='quantity']");
        qun_node.innerText = Number(qun_node.innerText) + 1;
    }
    else {
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
            lbl_div = document.createElement('DIV');

        lbl_div.setAttribute('data-row', 'desc');
        lbl_div.innerHTML = '<span class="width_40">Item Code</span>' +
            '<span class="width_40">Serial Number</span>';

        cell.setAttribute('colspan', '3');
        cell.appendChild(lbl_div);
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

    qt_node.value = Number(qt_node.value) + 1;

    return true;
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



function process_data() {
    const isu_tbl = document.getElementById('isu_lst_tbl'),
        rcv_stn = document.getElementById('rcv_stn'),
        rcv_usr = document.getElementById('rcv_usr'),
        isu_date = document.getElementById('isu_date'),
        des = document.getElementById('isu_lst_des'),
        rows = isu_tbl.rows,
        row_len = rows.length;

    if (row_len < 2) {
        alert('No items selected!');
        throw Error('issuing table does not contain any items!');
    }
    else if (rcv_stn.value === '' || rcv_usr.value === '' || isu_date.value === '') {
        alert('Please fill the required fields!');
        throw Error('required fields are not filled');
    }

    const isu_list = {
        'items': {
            'bulk': [],
            'inv': [],
            'ids': [],
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
                'description': `Description: ${ des.value ? des.value : 'not provided' }`,
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
            isu_list.items.ids.push(code_divs[j].dataset.invItemId);
        }

        isu_list.items.inv.push(inv_itm);
    }

    isu_list.details = {
        rcv_stn: rcv_stn.value,
        rcv_usr: rcv_usr.value,
        isu_date: isu_date.value,
        isu_stn: window.get_user_station().id,
        isu_usr: window.get_user().id,
        description: des.value,
    };

    //console.log(isu_list);

    return isu_list;
}


/**
 * submit issue & reset form with updated data
 */
function submit_issue(isu_mdl, isu_list ) {
    display_loading(isu_mdl);

    const pdf_list = cloneDeep(isu_list);
    delete isu_list.model_details;
    delete isu_list.items.bulk;
    delete isu_list.items.inv;

    const rows = document.getElementById('isu_lst_tbl').rows;
    //console.log('data sending');

    const XHR = new XMLHttpRequest();

    XHR.addEventListener('load', function(event) {
        if(event.target.status === 200) {
            const res_obj = JSON.parse(event.target.response);

            reset_form(res_obj.items, rows, set_isu_table);

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
    XHR.open('POST', '/inventory/transaction/station/issue', true);
    XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    XHR.send('_token=' + window.getCSRF() + '&' + 'issue=' + JSON.stringify(isu_list));
}
