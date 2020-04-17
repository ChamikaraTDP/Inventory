import { init_add_tab } from './add_items';
import { init_isu_tab } from './issue_items';
export { tab_selection };

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
    case 4:
        window.location.replace("inventory/new/item");
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
        document.getElementById('grid_area').innerHTML = event.target.response;
        console.log('Add tab content attached');
        init_add_tab();
    });
    XHR.addEventListener('abort', function(event) {
        console.log('request aborted' + event.target.responseText);
    });
    XHR.addEventListener('error', function(event) {
        console.log('something went wrong' + event.target.responseText);
    });
    XHR.open('GET', '/inventory/tab/add', true);
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
        const res_obj = JSON.parse(event.target.response);
        document.getElementById('grid_area').innerHTML = res_obj.issue_view;
        init_isu_tab(res_obj.items);
        console.log('Issue tab content attached');
    });
    XHR.addEventListener('abort', function(event) {
        console.log('request aborted' + event.target.responseText);
    });
    XHR.addEventListener('error', function(event) {
        console.log('something went wrong' + event.target.responseText);
    });
    XHR.open('GET', '/inventory/tab/issue', true);
    XHR.setRequestHeader('Content-type', 'text/html; charset=UTF-8');
    XHR.send();
}
