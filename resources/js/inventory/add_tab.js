import { get_parent, make_list } from './helpers/utils';
import jsPDF from 'jspdf';

export { init_add_tab, display_model, create_pdf };


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
 * @param {node} current add_btn node that called insert_row
 * @use make_list(), make_item_list()
 */
function insert_row(current) {
    const table = document.getElementById('tbl_body');
    if(!table) {
        throw new Error(' no table body exists with id=tbl_body ');
    }
    const row_count = table.rows.length;
    if (row_count > 0 && !current) {
        throw new Error(' no calling add button passed! ');
    }
    const row = table.insertRow(-1),
        cell1 = row.insertCell(0),
        cell2 = row.insertCell(1),
        cell3 = row.insertCell(2),
        cell4 = row.insertCell(3),
        cell5 = row.insertCell(4);

    cell1.setAttribute('class', 'ad_cat_td');
    cell1.innerHTML = `
        <div class="select">
            <select class='ad_cat_drop' name='category' required>
                <option value="">Select Category</option>
                ${ make_list(window.get_categories()) }
            </select>
        </div>`;

    cell1.querySelector("select[name='category']").addEventListener('change', function(){
        make_item_list(this);
    });

    cell2.innerHTML = `
        <div class="select">
            <select class="ad_itm_drop" name='item' required></select>
        </div>`;

    cell2.setAttribute('class', 'ad_itm_td');
    make_item_list(cell1.querySelector("select[name='category']"));

    cell3.innerHTML = `<input class='input_number_medium max_width_medium'
        type='number' name='quantity' min="1" required>`;

    cell4.innerHTML = `<input class='input_number_medium max_width_medium'
        type='number' name='unit_price' min='0'>`;

    cell5.innerHTML = `
        <button class='button is-info' type='button' name="ad_btn">
            <span class="icon">
                <i class="fas fa-plus"></i>
            </span>
        </button>
        <button class='button is-danger' style='visibility: hidden' type='button' name="rm_btn">
           <span class="icon">
               <i class="fas fa-minus"></i>
           </span>
        </button>`;

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

            let list = `<option value="">Select Item</option>`,
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
 * @use display_model()
 */
function take_on_submit() {
    const form = document.getElementById('ad_itm_form');
    const ad_model = document.getElementById('ad_mdl');

    const isu_list = process_data(form);

    display_model(ad_model, isu_list, sendData);
}


function process_data(form) {
    const supplier = form.querySelector('#ad_fm_sup').value.trim(),
        note_no = form.querySelector('#ad_fm_isn').value,
        desc = form.querySelector('#ad_fm_des').value;

    const isu_list = {
        'items': [],

        'model_details': {
            'heading': `Stock Note`,
            'top_left': [
                `Date : ${ form.querySelector('#ad_fm_date').value }`,
                `Received from : ${ supplier }`,
                `Issue Note no : ${ note_no }`
            ],
            'bottom_note': `Above items are recorded in the inventory.`,
            'description': `Description : ${ desc ? desc : 'not provided' }`,
            'sign_note': `(Stock Officer)`,
            'sign_usr_name' : window.get_user().name,
            'btn_text' : `Confirm`,
        }

    };

    let rows = form.querySelector('#tbl_body').rows,
        form_len = rows.length,
        cat = {},
        itm = {};

    for (let i = 0; i < form_len; i++) {
        cat = rows[i].querySelector("select[name='category']");
        itm = rows[i].querySelector("select[name='item']");

        let item = {
            category: cat.options[cat.selectedIndex].text,
            name: itm.options[itm.selectedIndex].text,
            quantity: rows[i].querySelector("input[name='quantity']").value,
            unit_val: rows[i].querySelector("input[name='unit_price']").value,
        };

        isu_list.items.push(item);
    }

    return isu_list;
}


function display_model(ad_model, isu_list, btn_func) {
    let ad_mdl_cont =
        `<div id="ad_mdl_cont" class="mdl_cont">
            <span id="ad_mdl_close" class="mdl_close">&times</span>
            <div>
                <div style="text-align: center"><strong>${ isu_list.model_details.heading }</strong></div>
                <div>`;

    if( isu_list.model_details.tran_det ) {
        ad_mdl_cont += `<div>${ isu_list.model_details.tran_det }</div>`;
    }

    const details = isu_list.model_details.top_left,
        det_count = details.length;

    for(let j = 0; j < det_count; j++) {
        ad_mdl_cont += `<div>${ details[j] }</div>`;
    }

    ad_mdl_cont += `
        </div>
        <br>
        <div>
            <table id="ad_mdl_tbl" class="mdl_table">
                <thead>
                    <tr>
                        <th>Item Category</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Unit Value(Rs/-)</th>
                    </tr>
                </thead>
                <tbody id="ad_mt_bd">`;

    let md_tbl_rows = ``,
        items = isu_list.items,
        itm_count = items.length;

    for (let i = 0; i < itm_count; i++) {
        md_tbl_rows += `
            <tr> 
                <td>${ items[i].category }</td>
                <td>${ items[i].name }</td>
                <td>${ items[i].quantity }</td>
                <td>${ items[i].unit_val }</td>
            </tr>`;
    }

    ad_mdl_cont += `${ md_tbl_rows }</tbody>
                    </table>
                </div>
            </div>
            <br>
            <div class="clearfix">
                <p>${ isu_list.model_details.description }</p>  
                <button id="mdl_conf_btn" type="button" class="button is-link is-outlined mdl_conf_btn">
                    ${ isu_list.model_details.btn_text }
                </button>
            </div>
        </div>`;

    ad_model.innerHTML = ad_mdl_cont;

    ad_model.querySelector('#mdl_conf_btn').addEventListener('click', function () {
        btn_func(ad_model, isu_list);
    });

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
function sendData(ad_model, pdf_list) {
    //console.log('initialize form data');

    const form = document.getElementById('ad_itm_form');

    display_loading(ad_model);

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
        //console.log('response loaded');

        if (event.target.status === 200) {
            //console.log('items added successfully');
            reset_form(form);
            pdf_list.model_details.tran_det = `Transaction ID: ${ event.target.responseText }`;
            display_success(ad_model, pdf_list);
        }
        else {
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

    XHR.send('_token=' + window.getCSRF() + '&' + 'data=' + JSON.stringify(js_obj));
}


function display_loading(ad_model) {
    const mdl_cont = ad_model.querySelector('#ad_mdl_cont');
    mdl_cont.innerHTML = `<p>processing request please wait...</p>`;
}


function display_success(ad_model, pdf_list) {
    const mdl_cont = ad_model.querySelector('#ad_mdl_cont');

    mdl_cont.innerHTML = `
        <span id="ad_mdl_close" class="mdl_close">&times;</span>                
        <p>Items added successfully!</p>
        <button id="print_btn" class="button is-medium" type="button">
            <span class="icon">
            <i class="fas fa-print"></i>
            </span>
            <span>Print</span>        
        </button>`;

    mdl_cont.querySelector('#ad_mdl_close').addEventListener('click', function() {
        ad_model.style.display = 'none';
    });

    mdl_cont.querySelector('button').addEventListener('click', function() {
        create_pdf(pdf_list);
    });
}


/**
 * reset add form after submission
 *
 * @use insert_row
 */
function reset_form(form){
    try {
        const rows_to_remove = document.getElementById('tbl_body').childNodes;
        const n_rows = rows_to_remove.length;

        let i = n_rows - 1;
        for (i; i >= 0; i--) {
            rows_to_remove[i].remove();
        }

        form.reset();
        insert_row();
        //console.log('form resets successfully');

    } catch (e) {
        console.log('error occurred while resetting the form' + e);
    }
}


function create_pdf(isu_list) {
    const pageWidth = 8.3,
        lineHeight = 1.2,
        margin = 0.5,
        fontSize = 12,
        ptsPerInch = 72,
        oneLineHeight = (fontSize * lineHeight) / ptsPerInch,
        doc = new jsPDF({
            unit: "in",
            lineHeight: lineHeight,
        });

    doc.setFontStyle("bold")
        .setFont("helvetica", "neue")
        .setFontSize(fontSize);

    let ymi = 1;

    // DFAR title
    doc.text(
        `Department of Fisheries and Aquatic Resources-Inventory`,
        pageWidth / 2,
        margin + ymi++ * oneLineHeight,
        { align: "center" }
    );

    // heading
    doc.text(
        `${ isu_list.model_details.heading }`,
        pageWidth / 2,
        margin + ymi++ * oneLineHeight,
        { align: "center" }
    );

    ymi += 1;

    doc.setFontStyle("normal")
        .text(`${ isu_list.model_details.top_left[0] }`, margin, margin + ymi * oneLineHeight)
        .text(`${ isu_list.model_details.tran_det }`, pageWidth - margin, margin + ymi++ * oneLineHeight,
            { align: 'right'})
        .text(`${ isu_list.model_details.top_left[1] }`, margin, margin + ymi++ * oneLineHeight)
        .text(`${ isu_list.model_details.top_left[2] }`, margin, margin + ymi++ * oneLineHeight);

    doc.autoTable({
        startY: margin + ymi * oneLineHeight,
        margin: 0.5,
        head: [ ['Item Category', 'Item Name', 'Quantity', 'Unit Value(Rs/-)'] ],
        body: data(isu_list),
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

    });

    let finalY = doc.previousAutoTable.finalY;
    ymi = 2;
    doc.text(`${ isu_list.model_details.description }`, margin, finalY + ymi * oneLineHeight);
    ymi += 2;
    doc.text(`${ isu_list.model_details.bottom_note }`, margin, finalY + ymi * oneLineHeight);
    ymi += 4;

    doc.text(`.......................................`, margin, finalY + ymi++ * oneLineHeight);
    doc.text(`${ isu_list.model_details.sign_usr_name }`, margin, finalY + ymi++ * oneLineHeight);
    doc.text(`${ isu_list.model_details.sign_note }`, margin, finalY + ymi * oneLineHeight);

    //doc.save('document.pdf');
    window.open(doc.output('bloburl'), '_blank');

}


function data(list) {
    let body = [];

    let items = list.items;
    let rowCount = items.length;

    for (let j = 0; j < rowCount; j++) {
        body.push([
            items[j].category,
            items[j].name,
            items[j].quantity,
            items[j].unit_val,

        ]);
    }

    return body;
}
