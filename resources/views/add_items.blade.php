@extends('layouts.top_navigation')

@section('forms')
    <!-- div container for all the elements -->
    <div class="grid_container">
        <div class="grid_box">
        <form class="grid_middle" id="myForm">
            <ol>
                <li><label for="form_in_1">Date:</label><input id="form_in_1" class="add_form_date" type="date" name="date"/></li>
                <li><label for="form_in_2">Received From:</label><input id="form_in_2" class="add_form_text" type="text" name="supplier"/></li>
                <li><label for="form_in_3">Issue Order No:</label><input id="form_in_3" class="add_form_text" type="text" name="issue_no"/></li>
            </ol>
            <table id="item_tbl">
                <thead>
                    <tr>
                        <th>Item Category</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Unit Value(Rs/-)</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="tbl_body"></tbody>
            </table>
            <label for="form_in_4">Description:</label><input id="form_in_4" class="add_form_text" type="text" name="description"/>
            <br/>
            <input type="submit" value="submit"/>
        </form>
        <div id="re_text"></div>
        </div>
    </div>

    <script>
        'use strict';

        const items = @json($items); // make js object using items

        // change items dropdown
        function change_category(node){

            //callback func for filter
            function check_category (item) {
                return item.category_id == node.value;
            }

            let cat_items = items.filter(check_category); //filter items according to chosen category

            let list = "<select name='item_id'>\n";
            let x = 0;
            for (x of cat_items) {
                list += "<option value=" + x.id + ">" + x.name;
            }
            list += "</select>";

            let item_select = node.parentNode.nextSibling;
            item_select.innerHTML = list;

        }

        // make category dropdown list
        function make_cat_list (categories) {

            let list = "<select name='category' onchange='change_category(this)'>\n";
            let x = 0;
            for (x of categories) {
                list += "<option value=" + x.id + ">" + x.name;
            }
            list += "</select>";
            return list;

        }

        const categories = @json($categories); // make js object using categories
        let list = make_cat_list(categories); // pass the object to make the list

        // insert rows according to user
        function insert_row(current) {

            let table = document.getElementById("tbl_body");
            let row_count = table.rows.length;

            let row = table.insertRow(-1);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);
            let cell5 = row.insertCell(4);

            cell1.innerHTML = list; // attach the list string to the row

            cell2.innerHTML = "<select name='item_id'>\n" +
                "              </select>";

            cell3.innerHTML = "<input type='text' name='quantity'>";

            cell4.innerHTML = "<input type='text' name='unit_price'>";

            cell5.innerHTML = "<span class='add_btn' onclick='insert_row(this);'>Add</span><span class='rm_btn' onclick='delete_row(this);' style='display: none'>Remove</span>";

            // configure buttons
            if(row_count > 0) {
                current.style.display = 'none';
                let next = current.nextSibling;
                next.style.display = 'inline-block';
                let x = cell5.getElementsByClassName("rm_btn");
                x[0].style.display = 'inline-block';
            }

            change_category(cell1.firstChild);

        }

        // remove rows from the table
        function delete_row(current) {

            let row_index =  current.parentNode.parentNode.rowIndex;
            let table = document.getElementById("tbl_body");
            let row_count = table.rows.length;
            table.deleteRow(row_index-1);

            if (row_index === row_count) {
                let add_btn = table.rows[row_index - 2].querySelectorAll("span.add_btn");
                add_btn[0].style.display = 'inline-block';
            }
            if (row_count === 2) {
                let row = table.rows[0].getElementsByClassName("rm_btn");
                row[0].style.display = 'none';
            }

        }

        insert_row(-1); // insert initial row

        window.addEventListener('load', function () {

            let form = document.getElementById("myForm");

            function sendData() {

                console.log("data sending");

                const XHR = new XMLHttpRequest();

                let js_obj = {};

                const FD = new FormData(form);

                js_obj.form_details = {
                    'date': FD.get('date'),
                    'supplier': FD.get('supplier'),
                    'issue_no': FD.get('issue_no'),
                    'description': FD.get('description')
                };

                js_obj.item_details = [];

                for (let i = 0; i < FD.getAll('item_id').length; i++) {
                    js_obj.item_details.push(
                        {
                            'item_id': FD.getAll('item_id')[i],
                            'quantity': FD.getAll('quantity')[i],
                            'unit_price': FD.getAll('unit_price')[i]
                        }
                    );
                }

                XHR.addEventListener('load', function (event) {
                    console.log("response loaded");
                    console.log(event.target.responseText);
                    alert("Items added successfully");
                    reset_form();
                });

                XHR.addEventListener('abort', function (event) {
                    console.log("request aborted");
                });

                XHR.addEventListener('error', function (event) {
                    console.log("something went wrong");
                });

                XHR.open('POST', '{{ route('send_data') }}', true);

                XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                XHR.send('_token=' + '{{ csrf_token() }}' + '&' + 'data=' + JSON.stringify(js_obj));

            }


            let reset_form = () => {
                try {
                    let rows_to_remove = document.getElementById('tbl_body').childNodes;
                    let n_rows = rows_to_remove.length;
                    let i =  n_rows- 1;
                    for ( i ; i >= 0; i--) {
                        rows_to_remove[i].remove();
                    }

                    form.reset();
                    insert_row();
                    console.log("form resets successfully");

                } catch (e) {
                    console.log("error occurred while resetting the form" + e);
                }
            };

            // ...and take over its submit event.
            form.addEventListener( "submit", function ( event ) {
                event.preventDefault();
                sendData();
            });

        });

    </script>

@endsection

