import { make_list, get_parent, tog_row_disp } from './helpers/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
export { init_isu_tab };

function init_isu_tab(avl_itms) {
    set_item_table(avl_itms);
    set_isu_list();
    document.getElementById('isu_sub_btn').addEventListener('click', display_model);
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

                div.querySelector("button[name='inv_ad_btn']")
                    .addEventListener('click', function(event) {
                        inv_to_isu(event.target, prn_row);
                    });

                div.querySelector("button[name='inv_itm_rm_btn']")
                    .addEventListener('click', function(event) {
                        rm_function(event.target, prn_row, cell);
                    });

                div.querySelector("button[name='inv_itm_ad_btn']").
                    addEventListener('click', function(event) {
                        add_div(event.target, cell, prn_row );
                    });

                cell.appendChild(div);
            }
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

            add_all.addEventListener('click', function() {
                add_all_itms(row, prn_row);
            });

            isu_node.disabled = true;
            fil_btn.style.display = 'none';
            drop.style.display = 'inline-block';
            add_all.style.display = 'inline-block';
            rmv_all.style.display = 'inline-block';
        }

    }

    function add_all_itms(row, prn_row) {
        const add_btns = row.firstChild.querySelectorAll("button[name='inv_ad_btn']:enabled");

        for(let btn of add_btns) {
            if( !inv_to_isu(btn, prn_row) ) {
                break;
            }
        }
    }


    function inv_to_isu(ad_btn, prn_row) {
        const info_div = get_parent(ad_btn, 'DIV');
        const item_inp = info_div.querySelector("input[name='itm_code']");
        const item_code = item_inp.value;
        const seri_inp = info_div.querySelector("input[name='serial_no']");
        const serial = seri_inp.value;

        if(item_code === '' && serial === '') {
            alert('You must fill Item code or Serial number!');
            return false;
        }

        ad_btn.disabled = true;
        const rm_btn = info_div.querySelector("button[name='inv_itm_rm_btn']");
        rm_btn.disabled = true;
        item_inp.disabled = true;
        seri_inp.disabled = true;
        ad_btn.setAttribute('class', 'add_btn isu_ad_btn ad_btn_dis');
        rm_btn.setAttribute('class', 'add_btn isu_ad_btn ad_btn_dis');

        const rm_all = prn_row.querySelector("button[name='rmv_all_btn']");

        let cell1 = prn_row.querySelector("td[data-cell='name']");
        const itm_id = cell1.getAttribute('data-item-id');
        let itm_row = document.getElementById('inv_itm_' + itm_id);

        const div = document.createElement('DIV');
        div.setAttribute('data-row', 'info');

        div.innerHTML = '<span class="width_40" data-cell="code">' +
                item_code +
            '</span><span class="width_40" data-cell="serial">' +
            serial +
           '</span><button class="rm_btn isu_ad_btn" type="button" name="inv_itm_rm_btn">Remove</button>';

        div.querySelector("button[name='inv_itm_rm_btn']")
            .addEventListener('click', function() {
                const qun_node = itm_row.querySelector("td[data-cell='quantity']");
                const qun = Number(qun_node.innerText) - 1;

                if(qun === 0) {
                    itm_row.nextElementSibling.remove();
                    itm_row.remove();

                    rm_all.setAttribute('class', 'rm_btn isu_ad_btn');
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
                ad_btn.setAttribute('class', 'add_btn isu_ad_btn');
                rm_btn.setAttribute('class', 'rm_btn isu_ad_btn');

            });

        if(itm_row) {
            const cell = itm_row.nextElementSibling.firstChild;
            cell.appendChild(div);
            const qun_node = itm_row.querySelector("td[data-cell='quantity']");
            qun_node.innerText = Number(qun_node.innerText) + 1;
        }
        else {
            rm_all.disabled = true;
            rm_all.setAttribute('class', 'add_btn isu_ad_btn ad_btn_dis');

            itm_row = document.createElement('TR');
            const cell2 = document.createElement('TD');
            const cell3 = document.createElement('TD');

            itm_row.setAttribute('id', 'inv_itm_' + itm_id);
            itm_row.setAttribute('data-item-type', '1');
            cell1 = cell1.cloneNode(true);
            cell2.innerHTML = '1';
            cell2.setAttribute('data-cell', 'quantity');
            cell3.innerHTML = '<button class="add_btn isu_ad_btn" type="button" name="isu_tog_btn">V</button>'+
               '<button class="rm_btn isu_ad_btn" type="button" name="rmv_all_btn">Rmv</button>';

            itm_row.appendChild(cell1);
            itm_row.appendChild(cell2);
            itm_row.appendChild(cell3);

            const code_row = document.createElement('TR');
            const cell = document.createElement('TD');
            const labl_div = document.createElement('DIV');

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

    /*${info_div.querySelector("input[name='item_code']").value}
    *
    *  ${info_div.querySelector("input[name='serial_no']").value}*/

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

            row.setAttribute('data-item-type', '0');
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
        document.getElementById('rcv_usr_dv').innerHTML = `
            <label for='rcv_usr'>Receiving Officer:</label>
            <select id='rcv_usr' name='rcv_usr'>${ list }</script>`;
    }
}


function display_model() {
    const isu_tbl = document.getElementById('isu_lst_tbl'),
        rcv_stn = document.getElementById('rcv_stn'),
        rcv_usr = document.getElementById('rcv_usr'),
        isu_date = document.getElementById('isu_date'),
        isu_mdl = document.getElementById('isu_mdl'),
        rows = isu_tbl.rows,
        row_len = rows.length;

    if (row_len < 2) {
        alert('No items selected!');
    }
    else if (isu_date.value === '') {
        alert('Please fill the required fields!');
    }
    else {
        const isu_list = {
            'items': {
                'bulk': [],
                'inv': [],
            },

            'details': {
                rcv_stn: rcv_stn.options[rcv_stn.selectedIndex].text,
                rcv_usr: rcv_usr.options[rcv_usr.selectedIndex].text,
                isu_date: isu_date.value,
                isu_stn: window.get_user_station().name,
                isu_usr: window.get_user().name,
            },
        };


        let isu_mdl_cont =
            `<div id="isu_mdl_cont" class="mdl_cont">
                <span id="isu_mdl_close" class="mdl_close">&times</span>
                <div>
                    <div style="text-align:center; font-size:1.1rem">Issue Note</div>
                    <div>Issued Station: ${ isu_list.details.isu_stn }</div>
                    <div>Received Station: ${ isu_list.details.rcv_stn }</div>
                    <div>Issued to: ${ isu_list.details.rcv_usr }</div>
                    <br>
                    <div>
                        <table id="isu_mdl_tbl">
                            <thead>
                                <tr>
                                    <th>Description of Stores</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody id="isu_mt_bd">`;

        let md_tbl_rows = ``;
        for (let i = 1; i < row_len; i++) {

            if( rows[i].getAttribute('data-item-type') ===  '1') {
                let inv_itm = {
                    'name': rows[i].querySelector("td[data-cell='name']").innerText,
                    'quantity': rows[i].querySelector("td[data-cell='quantity']").innerText,
                    'codes': [],
                };

                md_tbl_rows += `
                    <tr> 
                       <td>${ inv_itm.name }</td>
                       <td>${ inv_itm.quantity }</td>                                
                    </tr>
                    <tr>
                        <td colspan="2">`;

                i++;

                let code_divs = rows[i].querySelectorAll("div[data-row='info']");
                let div_count = code_divs.length;

                md_tbl_rows += `
                    <div>
                      <span class="width_40">Item Code</span>
                      <span class="width_40">Serial Number</span>
                    </div>`;

                for(let m = 0; m < div_count; m++) {
                    inv_itm.codes.push({
                        'code': code_divs[m].querySelector("span[data-cell='code']").innerText,
                        'serial': code_divs[m].querySelector("span[data-cell='serial']").innerText,
                    });

                    md_tbl_rows += `
                        <div>
                            <span class="width_40">
                                ${ inv_itm.codes[m].code }
                            </span>
                            <span class="width_40">
                                ${ inv_itm.codes[m].serial }
                            </span>
                        </div>`;
                }

                md_tbl_rows += `</td></tr>`;

                isu_list.items.inv.push(inv_itm);

            }
            else {

                let bulk = {
                    'name': rows[i].querySelector("td[data-cell='name']").innerText,
                    'quantity': rows[i].querySelector("td[data-cell='quantity']").innerText,
                };

                md_tbl_rows += `
                    <tr> 
                       <td>${ bulk.name }</td>
                       <td>${ bulk.quantity }</td>                                
                    </tr>`;

                isu_list.items.bulk.push(bulk);

            }
        }

        isu_mdl_cont += `        ${ md_tbl_rows }
                            </tbody>
                        </table>
                    </div>
                </div>
                <br>
                <div class="clearfix">
                    <p>Issued on ${ isu_date.value } and the issue duly entered.</p>
                    <br>
                    <div>................................</div>
                    <div>${ isu_list.details.isu_usr }</div>
                    <div>(Issuing Officer)</div>
                    <button id="isu_conf_btn" type="button" class="add_btn mdl_conf_btn">Confirm</button>
                </div>
            </div>`;

        isu_mdl.innerHTML = isu_mdl_cont;

        isu_mdl.querySelector('#isu_conf_btn').addEventListener('click', function(){
            submit_issue(isu_tbl, isu_date, rcv_stn, rcv_usr, isu_mdl, isu_list);
            // create_pdf(isu_list);
        });

        isu_mdl.querySelector('#isu_mdl_close').addEventListener('click', function() {
            isu_mdl.style.display = 'none';
        });

        isu_mdl.style.display = 'block';
    }
}

function create_pdf(isu_list) {
    const pageWidth = 8.3,
        lineHeight = 1.2,
        margin = 0.5,
        maxLineWidth = pageWidth - margin * 2,
        fontSize = 12,
        ptsPerInch = 72,
        oneLineHeight = (fontSize * lineHeight) / ptsPerInch,
        inv_itms = isu_list.items.inv,
        inv_len = inv_itms.length,
        doc = new jsPDF({
            unit: "in",
            lineHeight: lineHeight,
        });

    doc.setFontStyle("bold")
        .setFont("helvetica", "neue")
        .setFontSize(fontSize)
        .text(
            "Issue Note",
            pageWidth/2,
            margin + oneLineHeight,
            { align: "center" }
        );

    doc.setFontStyle("normal")
        .text(`Issued Station: ${ window.get_user_station().name }`, margin, margin + 3 * oneLineHeight)
        .text(`Received Station: ${ isu_list.details.rcv_stn }`, margin, margin + 4 * oneLineHeight)
        .text(`Received Officer: ${ isu_list.details.rcv_usr }`, margin, margin + 5 * oneLineHeight);

    doc.autoTable({
        startY: margin + 6 * oneLineHeight,
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

    let finalY = doc.previousAutoTable.finalY;
    doc.text(`Issue made on ${ isu_list.details.isu_date } and issue is duly entered.`,
        margin, finalY + 2 * oneLineHeight);

    doc.text(`................................`, margin, finalY + 6 * oneLineHeight);
    doc.text(`${ window.get_user().name }`, margin, finalY + 7 * oneLineHeight);
    doc.text(`(Issuing Officer)`, margin, finalY + 8 * oneLineHeight);

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
function submit_issue( isu_tbl, isu_date, rcv_stn, rcv_usr, isu_mdl, pdf_list) {

    display_loading(isu_mdl);

    const isu_list = {
        'items': {
            'bulk': [],
            'inv': [],
        },

        'details': {},
    };

    const rows = isu_tbl.rows,
        row_len = rows.length;

    for (let m = 1; m < row_len; m++) {

        if( rows[m].getAttribute('data-item-type') ===  '1') {

            let inv_itm = {
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
                    'item_id': rows[m].querySelector(
                        "td[data-cell='name']").getAttribute('data-item-id'),
                    'quantity': rows[m].querySelector("td[data-cell='quantity']").innerText,
                }
            );
        }
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

        reset_form(res_obj.items, rows);
        display_success(isu_mdl, pdf_list);
    });
    XHR.addEventListener('abort', function(event) {
        console.log('request aborted' + event.target.responseText);
    });
    XHR.addEventListener('error', function(event) {
        console.log('something went wrong' + event.target.responseText);
    });
    XHR.open('POST', '/issue_items', true);
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
