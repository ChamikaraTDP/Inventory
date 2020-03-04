let nv_tabs = document.querySelectorAll(".nv-box button");

function tab_selection(tab_no) {
    nv_tabs.forEach(function (node) {
            node.style.backgroundColor = "";
            node.style.color = "";
    });

    nv_tabs[tab_no].style.backgroundColor = "#004FC8";
    nv_tabs[tab_no].style.color = "white";
}

tab_selection(0);

/*
function insert_row(current) {

    let table = document.getElementById("tbl_body");
    let row_count = table.rows.length;

    let row = table.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    cell1.innerHTML = "<select name='vel'>\n" +
        "                  <option value='volvo'>Volvo</option>\n" +
        "                  <option value='saab'>Saab</option>\n" +
        "                  <option value='fiat'>Fiat</option>\n" +
        "                  <option value='audi'>Audi</option>\n" +
        "              </select>";

    cell2.innerHTML = "<select name='vel'>\n" +
        "                  <option value='volvo'>Volvo</option>\n" +
        "                  <option value='saab'>Saab</option>\n" +
        "                  <option value='fiat'>Fiat</option>\n" +
        "                  <option value='audi'>Audi</option>\n" +
        "              </select>";


    cell3.innerHTML = "<input type='text' name='quantity'>";

    cell4.innerHTML = "<input type='text' name='unit_val'>";

    cell5.innerHTML = "<span class='add_btn' onclick='insert_row(this);'>Add</span><span class='rm_btn' onclick='delete_row(this);' style='display: none'>Remove</span>";

    if(row_count > 0) {
        current.style.display = 'none';
        let next = current.nextSibling;
        next.style.display = 'inline-block';
        let x = cell5.getElementsByClassName("rm_btn");
        x[0].style.display = 'inline-block';
    }
}

insert_row(-1);

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

 */
