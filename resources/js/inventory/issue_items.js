import { make_list, get_parent } from './helpers/utils';
export { init_isu_tab };

function init_isu_tab(avl_itms, stations, users) {
    set_item_table(avl_itms);
    set_stn_drop(stations, users);

    document.getElementById('isu_sub_btn').addEventListener('click', submit_issue);
}

/**
 * initialize the avail items table in isu tab
 *
 * @param {array} avl_itms available items in station
 */
function set_item_table(avl_itms) {
    const tbl_bd = document.getElementById('itm_tbl_bd');

    let row = {};
    let cell1 = {};
    let cell2 = {};
    let cell3 = {};
    let cell4 = {};
    let cell5 = {};

    let g_itm = {};
    let cat = {};

    let litm = {};
    for (litm of avl_itms) {
        row = document.createElement('TR');

        cell1 = document.createElement('TD');
        cell2 = document.createElement('TD');
        cell3 = document.createElement('TD');
        cell4 = document.createElement('TD');
        cell5 = document.createElement('TD');

        g_itm = items.find((gitm) => {
            return gitm.id === litm.item_id;
        });

        cat = categories.find((gcat) => {
            return gcat.id === g_itm.category_id;
        });

        cell1.innerHTML = g_itm.name;
        cell1.setAttribute('data-item-id', g_itm.id);
        cell1.setAttribute('class', 'isu_itm_nem');
        cell2.innerHTML = cat.name;
        cell3.innerHTML = litm.quantity;
        cell3.setAttribute('class', 'avl_qan_td');
        cell4.innerHTML = `<input class='isu_qan_inp' type='number' min='1' max='${litm.quantity}'/>`;
        cell4.setAttribute('class', 'isu_qan_td');
        cell5.innerHTML = `<button type='button' id='isu_ad_btn_${g_itm.id}' class='add_btn isu_ad_btn'>Add</button>`;

        (cell5.getElementsByClassName('isu_ad_btn')[0]).addEventListener('click', function () {
            itm_to_isu(this)
        });

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(cell5);

        tbl_bd.appendChild(row);
    }
}

/**
 * add items to issuing list
 * @param node add btn
 */
function itm_to_isu(node) {
    let prn_row = get_parent(node, 'TR');

    const qt_td = prn_row.getElementsByClassName('isu_qan_td')[0];

    /*const qt_td = node.parentNode.previousSibling;*/
    let isu_qt = qt_td.firstChild.value;
    let av_qt = (prn_row.getElementsByClassName('avl_qan_td')[0]).firstChild.nodeValue;

    isu_qt = Number(isu_qt);
    av_qt = Number(av_qt);

    if (isu_qt > av_qt || isu_qt < 1) {
        alert('invalid input');
    } else {
        const row = document.createElement('TR');

        let cell1 = prn_row.getElementsByClassName('isu_itm_nem')[0];
        cell1 = cell1.cloneNode(true);
        const cell2 = document.createElement('TD');
        const cell3 = document.createElement('TD');

        cell2.innerHTML = String(isu_qt);
        cell3.innerHTML = `<button type='button' class='rm_btn isu_ad_btn'>Remove</button>`;
        (cell3.getElementsByClassName('rm_btn')[0]).addEventListener('click', function() {
            const ad_btn_id = 'isu_ad_btn_' + cell1.getAttribute('data-item-id');
            itm_fm_isu(this, ad_btn_id);
        });

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);

        document.getElementById('isu_tbl_bd').appendChild(row);

        node.disabled = true;
        node.setAttribute('class', 'add_btn isu_ad_btn ad_btn_dis');
        qt_td.firstChild.disabled = true;
    }
}

/**
 * remove rows form issuing list
 *
 * @param {node} node remove btn
 * @param {string} ad_btn id of the add btn who made this row
 */
export default function itm_fm_isu(node, ad_btn) {
    get_parent(node, 'TR').remove();
    ad_btn = document.getElementById(ad_btn);
    ad_btn.disabled = false;
    ad_btn.setAttribute('class', 'add_btn isu_ad_btn');
    let prn_row = get_parent(ad_btn, 'TR');
    (prn_row.getElementsByClassName('isu_qan_td')[0]).firstChild.disabled = false;
}

/**
 * create receiving station & receiving officer dropdowns
 *
 * @param stations
 * @param users
 * @use make_list()
 */
function set_stn_drop(stations, users) {
    const list = make_list(stations);
    const stn_drp_dv = document.getElementById('rcv_stn_dv');
    stn_drp_dv.innerHTML = `<label for='rcv_stn'>Receiving Station:</label>
        <select id='rcv_stn' name='rcv_stn'>${list}</script>`;

    const rcv_stn = document.getElementById('rcv_stn');

    rcv_stn.addEventListener('change', (event) => {
        make_usr_list(event.target.value);
    });

    make_usr_list(rcv_stn.value);

    function make_usr_list(stn_id) {
        const stn_users = users.filter(check_station); // filter items according to the chosen category

        function check_station(usr) { // callback func for filter
            return usr.station_id == stn_id;
        }

        const list = make_list(stn_users);
        document.getElementById('rcv_usr_dv').innerHTML = `<label for='rcv_usr'>Receiving Officer:</label>
            <select id='rcv_usr' name='rcv_usr'>${list}</script>`;
    }
}

/**
 * xhr to submit issue & reset form with updated data
 */
function submit_issue() {
    const tbl = document.getElementById('isu_lst_tbl'),
          isu_no = document.getElementById('isu_no'),
          rcp_no = document.getElementById('rcp_no'),
          rcv_stn = document.getElementById('rcv_stn'),
          rcv_usr = document.getElementById('rcv_usr'),
          isu_date = document.getElementById('isu_date'),
          row_len = tbl.rows.length;

    if (row_len < 2) {
        alert('No items selected!');
    } else if (isu_no.value === '' || isu_date.value === '' || rcp_no.value === '') {
        alert('Please fill the required fields!');
    } else {
        const isu_list = {};
        isu_list.items = [];

        for (let m = 1; m < row_len; m++) {
            isu_list.items.push({
                'item_id': tbl.rows[m].cells[0].getAttribute('data-item-id'),
                'quantity': tbl.rows[m].cells[1].innerHTML,
            });
        }

        isu_list.details = {
            'isu_no': isu_no.value,
            'rcp_no': rcp_no.value,
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
            alert('Issue successful');
        });
        XHR.addEventListener('abort', function(event) {
            console.log('request aborted' + event.target.responseText);
        });
        XHR.addEventListener('error', function(event) {
            console.log('something went wrong' + event.target.responseText);
        });
        XHR.open('POST', '/issue_items', true);
        XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        XHR.send('_token=' + getCSRF() + '&' + 'issue=' + JSON.stringify(isu_list));


        const reset_form = (items) => {
            try {
                const rows_to_remove = tbl.rows;
                let i = row_len - 1;

                for (i; i > 0; i--) {
                    rows_to_remove[i].remove();
                }

                isu_no.value = '';
                rcp_no.value = '';
                isu_date.value = '';

                document.getElementById('itm_tbl_bd').innerHTML = '';

                set_item_table(items);

                console.log('isu form resets successfully');
            } catch (e) {
                console.log('error occurred while resetting the isu form' + e);
            }
        };
    }
}
