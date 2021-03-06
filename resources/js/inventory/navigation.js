import { init_add_tab } from './add_tab';
import { init_isu_tab as init_isu_stock } from './issue_tab';
import { init_isu_tab as init_isu_station } from './issue_tab_general';
import { init_view_tab } from './view_tab';
import { init_reports_tab } from './reports_tab';
import axios from 'axios';

export { tab_selection };

/**
 * configure color of tabs
 * load tab using xhr
 *
 * @param {number} tab_no       The index of tab
 */
function tab_selection(tab_no) {
    if( !Number.isInteger(tab_no) || tab_no > 3 || tab_no < 0) {
        console.error('invalid tab selection');
        return;
    }

    document.getElementById('spinner').style.display = 'flex';

    const nv_tabs = document.querySelectorAll('.tabs li');

    nv_tabs.forEach(function(node) {
        node.classList.toggle('is-active', false);
    });

    document.getElementById(`tab_${tab_no}`).classList.toggle('is-active');

    switch (tab_no) {
    case 0:
        get_add_tab();
        break;
    case 1:
        get_issue_tab();
        break;
    case 2:
        get_view_tab();
        break;
    case 3:
        get_reports_tab();
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
    axios.get(`/inventory/tab/add`)
        .then(response => {
            document.getElementById('grid_area').innerHTML = response.data;
            init_add_tab();
            document.getElementById('spinner').style.display = 'none';

        })
        .catch(error => {
            console.error('There has been a problem with your get_add request:', error.message);
        });
}

/**
 * xhr to get issue tab
 *
 */
function get_issue_tab() {
    if (window.get_user().station_id === 1) {
        axios.get(`/inventory/tab/issue/stock`)
            .then(response => {
                document.getElementById('grid_area').innerHTML = response.data.issue_view;
                init_isu_stock(response.data.items);

                document.getElementById('spinner').style.display = 'none';

            }).catch(error => {
                console.error('There has been a problem with your get_issue request:', error.message);
            });
    }
    else {
        axios.get(`/inventory/tab/issue/station?stn=${window.get_user_station().id}`)
            .then(response => {
                document.getElementById('grid_area').innerHTML = response.data.issue_view;
                init_isu_station(response.data.items);

                document.getElementById('spinner').style.display = 'none';

            }).catch(error => {
                console.error('There has been a problem with your get_issue request:', error.message);
            });
    }
}


/**
 * xhr to get view tab
 */
function get_view_tab() {
    axios.get(`/inventory/tab/view?stn=${ window.get_user_station().id }`)
        .then(response => {
            document.getElementById('grid_area').innerHTML = response.data.view_tab;
            init_view_tab(response.data.trans);
            document.getElementById('spinner').style.display = 'none';

        })
        .catch(error =>{
            console.error('There has been a problem with your get_view request:', error.message);
        });
}

/**
 * xhr to get view tab
 */
function get_reports_tab() {
    axios.get(`/inventory/tab/reports`)
        .then(response => {
            document.getElementById('grid_area').innerHTML = response.data;
            init_reports_tab();
            document.getElementById('spinner').style.display = 'none';

        })
        .catch(error => {
            console.error('There has been a problem with your get_reports request:', error.message);
        });
}
