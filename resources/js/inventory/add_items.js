'use strict';

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

    cell1.innerHTML = make_cat_list(categories, 'category', 'make_item_list(this)', '');

    cell2.innerHTML = '<select name=\'item_id\'></select>';

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
