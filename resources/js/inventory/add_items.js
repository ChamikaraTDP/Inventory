import { get_parent, make_list } from './helpers/utils';
export { init_add_tab };

function init_add_tab() {
    insert_row();
    init_submit();
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
    if(!window.items){
        throw new Error(' items not defined globally! ');
    }

    let a = get_parent(node, 'TR');

    if (a.tagName !== 'TR') {
        throw new Error(' no "TR" tag found!, provided select element does not belong to a table row ');
    }

    const item_select = a.getElementsByClassName('ad_itm_td')[0]; // items dropdown td node
    if(item_select) {
        const cat_items = (window.items).filter(check_category); // filter items according to the chosen category

        function check_category(item) {     // callback func for filter
            return item.category_id == node.value;
        }

        item_select.innerHTML =`<select class="ad_itm_drop" name="item_id">${make_list(cat_items)}</select>`;
    }
    else {
        throw Error(' no "TD" found to attach the list ');
    }
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

    const row = table.insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);

    cell1.setAttribute('class', 'ad_cat_td');
    cell2.setAttribute('class', 'ad_itm_td');

    cell1.innerHTML = `<select class='ad_cat_drop' name='category'>${make_list(window.categories)}</select>`;

    cell1.firstChild.addEventListener('change', function(){ make_item_list(this); });

    cell2.innerHTML = `<select name='item_id'></select>`;
    cell3.innerHTML = `<input class='ad_fm_inp' type='number' name='quantity' min="1" required>`;
    cell4.innerHTML = `<input class='ad_fm_inp' type='number' name='unit_price' min='0'>`;
    cell5.innerHTML = `<button type='button' class='add_btn'>Add</button>` +
        `<button class='rm_btn' style='visibility: hidden'>Remove</button>`;

    (cell5.getElementsByClassName('add_btn')[0]).addEventListener('click', function() {
        insert_row(this);
    });

    const rm_btn = cell5.getElementsByClassName('rm_btn')[0];
    rm_btn.addEventListener('click', function() {
        delete_row(this);
    });

    // configure buttons
    if (row_count > 0 && !current){
        throw new Error(' no calling add button passed! ');
    }
    if (row_count > 0) {
        current.style.visibility = 'hidden';
        (current.parentNode.getElementsByClassName('rm_btn')[0]).style.visibility = 'visible';
        rm_btn.style.visibility = 'visible';
    }

    make_item_list(cell1.getElementsByClassName('ad_cat_drop')[0]);
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

    const row_index = current.parentNode.parentNode.rowIndex;
    if(!row_index || row_index < 0){
        throw new Error(' current is out of context! ');
    }

    const table = document.getElementById('tbl_body');
    if(!table) {
        throw new Error(' no table body exists with id=tbl_body ');
    }

    const row_count = table.rows.length;

    try {
        table.deleteRow(row_index - 1);
    }
    catch (exp) {
        throw exp;
    }

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
    const form = document.getElementById('ad_itm_form');

    /**
     * xhr to send data to controller
     * send add form data as json string
     *
     * @use reset_form()
     * @caller submit btn
     */
    function sendData() {
        console.log('initialize form data');

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

        let form_len = FD.getAll('item_id').length;
        for (let i = 0; i < form_len; i++) {
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
                alert('Items added successfully!');
                reset_form();
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
}
