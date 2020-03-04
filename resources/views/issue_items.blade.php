@extends('layouts.top_navigation')

@section('forms')
    <!-- div container for all the elements -->
    <div class="grid-container">
        <form class="add-form" id="myForm">
            <ol>
                <li><label for="form_in_1">Date:</label><input id="form_in_1" class="add-form-date" type="date" name="date"/></li>
                <li><label for="form_in_2">Received From:</label><input id="form_in_2" class="add-form-text" type="text" name="supplier"/></li>
                <li><label for="form_in_3">Issue Order No:</label><input id="form_in_3" class="add-form-text" type="text" name="issue_no"/></li>
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
            <label for="form_in_4">Description:</label><input id="form_in_4" class="add-form-text" type="text" name="description"/>
            <br/>
            <input type="submit" value="submit"/>
        </form>
        <div id="re_text"></div>
    </div>

@endsection

