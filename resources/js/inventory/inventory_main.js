'use strict';

$(() => {
    tab_selection(0);
});

/**
 * configure color of tabs
 * load tab using xhr
 *
 * @param {number} tab_no The index of tab
 */
function tab_selection(tab_no) {
    const nv_tabs = document.querySelectorAll('.nv_box button');

    nv_tabs.forEach(function(node) {
        node.style.backgroundColor = '';
        node.style.color = '';
    });

    nv_tabs[tab_no].style.backgroundColor = '#004FC8';
    nv_tabs[tab_no].style.color = 'white';

    switch (tab_no) {
    case 0:
        get_add_tab();
        break;
    case 1:
        get_issue_tab();
        break;
    case 2:
        alert('view tab');
        break;
    case 3:
        alert('reports tab');
        break;
    default:
        alert('invalid tab selection');
    }
}

/**
 * xhr to get add tab
 *
 * @external insert_row, init_submit inventory_main_js_blade
 */
function get_add_tab() {
    const XHR = new XMLHttpRequest();

    XHR.addEventListener('load', function(event) {
        console.log('response loaded');

        const grid_area = document.getElementById('grid_area');

        grid_area.innerHTML = event.target.response;
        console.log('Add tab content attached');

        insert_row(-1);
        init_submit();
    });

    XHR.addEventListener('abort', function(event) {
        console.log('request aborted' + event.target.responseText);
    });

    XHR.addEventListener('error', function(event) {
        console.log('something went wrong' + event.target.responseText);
    });

    XHR.open('GET', '/add_tab', true);

    XHR.setRequestHeader('Content-type', 'text/html; charset=UTF-8');

    XHR.send();
}

/**
 * xhr to get issue tab
 *
 * @external set_item_table, set_stn_drop   inventory_main_js_blade
 */
function get_issue_tab() {
    const XHR = new XMLHttpRequest();

    XHR.addEventListener('load', function(event) {
        console.log('response loaded');

        const grid_area = document.getElementById('grid_area');

        const res_obj = JSON.parse(event.target.response);
        grid_area.innerHTML = res_obj.issue_view;

        set_item_table(res_obj.items);
        set_stn_drop(res_obj.stations, res_obj.users);

        console.log('Issue tab content attached');
    });

    XHR.addEventListener('abort', function(event) {
        console.log('request aborted' + event.target.responseText);
    });

    XHR.addEventListener('error', function(event) {
        console.log('something went wrong' + event.target.responseText);
    });

    XHR.open('GET', '/issue_tab', true);

    XHR.setRequestHeader('Content-type', 'text/html; charset=UTF-8');

    XHR.send();
}


/**
 * make items dropdown
 *
 * @callers insert_row
 * @param {node} node table.td node representing the category dropdown
 * @use items global
 * @use make_cat_list()
 */
function make_item_list(node) {
    const cat_items = items.filter(check_category); // filter items according to the chosen category
    // callback func for filter
    function check_category(item) {
        return item.category_id == node.value;
    }

    const list = make_cat_list(cat_items, 'item_id', '', '');

    const item_select = node.parentNode.nextSibling; // items dropdown node
    item_select.innerHTML = list;
}

/**
 * make categories dropdown
 *
 * @callers make_item_list(), insert_row()
 * @param {json} categories global
 * @param {string} lname name of the list
 * @param {string} onchange function name to be called
 * @param {string} lid  id of the list
 * @return {string} html select element with categories
 */
function make_cat_list(categories, lname, onchange, lid) {
    let list = '';
    if (lid) {
        list = '<select id=\'' + lid + '\' name=\'' + lname + '\' onchange=\'' + onchange + '\'>\n';
    } else {
        list = '<select name=\'' + lname + '\' onchange=\'' + onchange + '\'>\n';
    }

    let x = 0;
    for (x of categories) {
        list += '<option value=' + x.id + '>' + x.name;
    }

    list += '</select>';

    return list;
}

/**
 * insert add form rows
 *
 * @callers add_btn, reset_form(), get_add_tab() inventory_main.js
 * @param {node} current add_btn node that called insert_row
 * @use make_cat_list(), make_item_list()
 */
function insert_row(current) {
    const table = document.getElementById('tbl_body');
    const row_count = table.rows.length;

    const row = table.insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);

    // attach the list string to the row
    cell1.innerHTML = make_cat_list(categories, 'category', 'make_item_list(this)', '');

    cell2.innerHTML = '<select name=\'item_id\'>\n' +
        '              </select>';

    cell3.innerHTML = '<input class=\'ad_fm_inp\' type=\'number\' name=\'quantity\' min="1" required>';

    cell4.innerHTML = '<input class=\'ad_fm_inp\' type=\'number\' name=\'unit_price\' min="0">';

    cell5.innerHTML = '<button type=\'button\' class=\'add_btn\' onclick=\'insert_row(this);\'>Add</button>' +
        '<button class=\'rm_btn\' onclick=\'delete_row(this);\' style=\'visibility: hidden\'>Remove</button>';

    // configure buttons
    if (row_count > 0) {
        current.style.visibility = 'hidden';
        const next = current.nextSibling;
        next.style.visibility = 'visible';
        const rm_btns = cell5.getElementsByClassName('rm_btn');
        rm_btns[0].style.visibility = 'visible';
    }

    make_item_list(cell1.firstChild);
}

/**
 * remove rows from the table
 *
 * @param {node} current rm_btn node that called delete_row
 */
function delete_row(current) {
    const row_index = current.parentNode.parentNode.rowIndex;
    const table = document.getElementById('tbl_body');
    const row_count = table.rows.length;

    table.deleteRow(row_index - 1);

    if (row_index === row_count) {
        const add_btn = table.rows[row_index - 2].querySelectorAll('.add_btn');
        add_btn[0].style.visibility = 'visible';
    }
    if (row_count === 2) {
        const rm_btns = table.rows[0].getElementsByClassName('rm_btn');
        rm_btns[0].style.visibility = 'hidden';
    }
}

/**
 * initialize add form so that it can be submitted using submit btn
 *
 * @caller get_add_tab() inventory_main.js
 *
 */
function init_submit() {
    const form = document.getElementById('myForm');

    /**
     * xhr to send data to controller
     * send add form data as json string
     *
     * @use reset_form()
     * @caller submit btn
     */
    function sendData() {
        console.log('data sending');

        const XHR = new XMLHttpRequest();

        const js_obj = {};

        const FD = new FormData(form);

        js_obj.form_details = {
            'date': FD.get('date'),
            'supplier': FD.get('supplier'),
            'issue_no': FD.get('issue_no'),
            'description': FD.get('description'),
        };

        js_obj.item_details = [];

        for (let i = 0; i < FD.getAll('item_id').length; i++) {
            js_obj.item_details.push(
                {
                    'item_id': FD.getAll('item_id')[i],
                    'quantity': FD.getAll('quantity')[i],
                    'unit_price': (FD.getAll('unit_price')[i] === '' ? 0 : FD.getAll('unit_price')[i]),
                },
            );
        }

        XHR.addEventListener('load', function(event) {
            console.log('response loaded');

            if (event.target.status === 200) {
                console.log(event.target.responseText);
                alert('Items added successfully');
                reset_form();
            } else {
                console.log(event.target.status + ' ' + event.target.statusText);
                alert('Something went wrong:(');
            }
        });

        XHR.addEventListener('abort', function(event) {
            console.log('request aborted');
        });

        XHR.addEventListener('error', function(event) {
            console.log('something went wrong');
        });

        XHR.open('POST', '/add_items', true);

        XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        XHR.send('_token=' + getCSRF() + '&' + 'data=' + JSON.stringify(js_obj));
    }

    /**
     * reset add form after submission
     *
     * @use insert_row
     * @caller init_submit
     */
    const reset_form = () => {
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
    };

    // take over submit event.
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        sendData();
    });

    $('#model_btn').click(() => {
        alert('hello');
    });
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
        cell2.innerHTML = cat.name;
        cell3.innerHTML = litm.quantity;
        cell4.innerHTML = '<input class="isu_qan_inp" type="number" min="1" max="' + litm.quantity + '"/>';
        cell5.innerHTML = '<button type=\'button\' id=\'isu_ad_btn_' + g_itm.id +
            '\' class=\'add_btn isu_ad_btn\' onclick=\'itm_to_isu(this)\'>Add</button>';

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
    const qt_td = node.parentNode.previousSibling;
    let isu_qt = qt_td.firstChild.value;
    let av_qt = qt_td.previousSibling.firstChild.nodeValue;

    isu_qt = Number(isu_qt);
    av_qt = Number(av_qt);

    if (isu_qt > av_qt || isu_qt < 1) {
        alert('invalid input');
    } else {
        const row = document.createElement('TR');

        let cell1 = qt_td.parentNode.firstChild;
        cell1 = cell1.cloneNode(true);
        const cell2 = document.createElement('TD');
        const cell3 = document.createElement('TD');

        cell2.innerHTML = String(isu_qt);
        cell3.innerHTML = '<button type=\'button\' class=\'rm_btn isu_ad_btn\' onclick=\'itm_fm_isu(this,' +
            'isu_ad_btn_' +
            cell1.getAttribute('data-item-id') + ')\'>Remove</button>';

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);

        isu_tbl_bd.appendChild(row);

        node.disabled = true;
        node.setAttribute('class', 'add_btn isu_ad_btn ad_btn_dis');
        qt_td.firstChild.disabled = true;
    }
}

/**
 * remove rows form issuing list
 *
 * @param {node} node remove btn
 * @param {node} ad_btn id of the add btn who made this row
 */
function itm_fm_isu(node, ad_btn) {
    node.parentNode.parentNode.remove();
    ad_btn.disabled = false;
    ad_btn.setAttribute('class', 'add_btn isu_ad_btn');
    ad_btn.parentNode.previousSibling.firstChild.disabled = false;
}

/**
 * create receiving station & receiving officer dropdowns
 *
 * @param stations
 * @param users
 * @use make_cat_list()
 */
function set_stn_drop(stations, users) {
    const list = make_cat_list(stations, 'rcv_stn', '', 'rcv_stn');
    const stn_drp_dv = document.getElementById('rcv_stn_dv');
    stn_drp_dv.innerHTML = '<label for="rcv_stn">Receiving Station:</label>' + list;

    rcv_stn.addEventListener('change', (event) => {
        make_usr_list(event.target.value);
    });

    make_usr_list(rcv_stn.value);

    function make_usr_list(node) {
        const stn_users = users.filter(check_station); // filter items according to the chosen category
        // callback func for filter
        function check_station(usr) {
            return usr.station_id == node;
        }

        const list = make_cat_list(stn_users, 'rcv_usr', '', 'rcv_usr');
        document.getElementById('rcv_usr_dv').innerHTML =
            '<label for="rcv_usr">Receiving Officer:</label>' + list;
    }
}

/**
 * xhr to submit issue & reset form with updated data
 */
function submit_issue() {
    const tbl = document.getElementById('isu_lst_tbl');
    const row_len = tbl.rows.length;

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

        (() => {
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
                console.log('request aborted');
            });

            XHR.addEventListener('error', function(event) {
                console.log('something went wrong');
            });

            XHR.open('POST', '/issue_items', true);

            XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            XHR.send('_token=' + getCSRF() + '&' + 'issue=' + JSON.stringify(isu_list));
        })();

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

                itm_tbl_bd.innerHTML = '';

                set_item_table(items);

                console.log('isu form resets successfully');
            } catch (e) {
                console.log('error occurred while resetting the isu form' + e);
            }
        };
    }
}
