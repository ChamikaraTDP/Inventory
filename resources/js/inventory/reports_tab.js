import axios from 'axios';
import Vue from 'vue';
import * as moment from 'moment';
import { tog_row_disp} from './helpers/utils';
import { create_pdf as report_pdf } from './issue_tab';

export { init_reports_tab };


function init_reports_tab() {
    document.getElementById('create_btn').addEventListener('click', function() {
        make_report(report_table);
    });

    let report_table = new Vue({
        el: '#report_table',

        data: {
            item_data: '',
            query_data: '',
        }
    });
}


function make_report(rep_app) {
    const start_date = document.getElementById('from_inp'),
        end_date = document.getElementById('to_inp'),
        tran_type = document.getElementById('tran_type'),
        item_type = document.getElementById('itm_type');

    const query_obj = {
        start_date: start_date.value,
        end_date: end_date.value,
        tran_type: tran_type.value,
        item_type: item_type.value,
        u_stn: window.get_user_station().id,
    };

    axios.post('inventory/report', query_obj)
        .then(response =>  {
            rep_app.item_data = response.data;
            rep_app.query_data = query_obj;
        })
        .catch(error => {
            console.error('There has been a problem with your request:', error.toJSON());
        });
}


Vue.component('item-table', {
    props: [ 'items', 'q_data' ],

    methods: {
        download_pdf() {
            create_pdf( this.items, this.q_data);
        }
    },

    template: `
        <table class="table is-bordered is-hoverable is-fullwidth" v-show="items">
            <thead>
                <tr>
                    <th>Description of Items</th>                    
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                <inv-record 
                    v-for="item in items.inv" 
                    :item="item"></inv-record>
                <bulk-record v-for="item in items.bulk" :item="item"></bulk-record>
                <tr>
                    <td></td>
                    <td>
                        <div style="display: flex; align-items: center; justify-content: center">
                           <button class="button is-link is-outlined" @click="download_pdf">Save Report</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>`,
});


Vue.component('bulk-record', {
    props: [ 'item' ],

    template: `
        <tr>
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>        
        </tr>`,
});


let inv_hr = Vue.component('inv-hr', {
    props: [ 'item' ],

    methods:  {
        toggleCodes() {
            tog_row_disp(document.getElementById(`inv_dr_${this.item.id}`));
        },
    },

    template: `
        <tr>
            <td>{{ item.name }}</td>
            <td>
                <div style="display: flex; align-items: center; justify-content: space-between">
                    <span>{{ item.quantity }}</span>
                    <span class="icon is-small" v-if="item.codes" @click="toggleCodes">
                        <i class="fas fa-chevron-down"></i>
                    </span>
                </div>
            </td>
        </tr>`,
});


let inv_dr = Vue.component('inv-dr', {
    props: [ 'item', 'showCodes' ],

    template: `
        <tr v-show="showCodes">
            <td class="strip_div" colspan="2">
                <div class="padding_left_10">
                  <strong class="width_40">Item Code</strong>
                  <strong class="width_40">Serial Number</strong>
                </div>
                <item-code v-for="code in item.codes" :data="code"></item-code>
            </td>
        </tr>`,
});


Vue.component('inv-record', {
    functional: true,

    props: [ 'item' ],

    render(createElement, context) {
        return [
            createElement(inv_hr, {
                props: {
                    item: context.props.item,
                }
            }),

            createElement(inv_dr, {
                attrs: {
                    id: `inv_dr_${context.props.item.id}`,
                },
                props: {
                    item: context.props.item,
                    showCodes: false,
                },
            }),
        ];
    },

});


Vue.component('item-code', {
    props: [ 'data' ],

    template: `
        <div class="padding_left_10">
            <span class="width_40">{{ data.code }}</span>
            <span class="width_40">{{ data.serial }}</span>
        </div>`,
});


function create_pdf(items, q_data) {

    let line1 = `Description of`;

    if( q_data.item_type === 'all' ) {
        line1 += ` all the`;
    }
    else if ( q_data.item_type === 'inv' ) {
        line1 += ' inventory';
    }
    else {
        line1 += ' bulk';
    }

    line1 += ` items of ${ window.get_user_station().name },`;

    //let line2 = ``;

    if( q_data.tran_type === 'rcv') {
        line1 += ` received`;
    }
    else {
        line1 += ` issued`;
    }


    if( q_data.start_date && q_data.end_date) {
        line1 += ` from ${ q_data.start_date } to ${ q_data.end_date }.`;
    }
    else if( q_data.start_date ){
        line1 += ` from ${ q_data.start_date } to ${ moment().format("YYYY-MM-DD") }.`;
    }
    else if( q_data.end_date) {
        line1 += ` up to ${ q_data.end_date }.`;
    }
    else {
        line1 += ` up to ${ moment().format("YYYY-MM-DD") }.`;
    }

    const report_data = {
        'items': items,

        'model_details': {
            'heading': `Report`,
            'top_left': {
                'Note': line1,
            },
            'top_right': {},
            'bottom_left': {
                'note': `Report is generated on ${ moment().format() } by ${ window.get_user().name }.`,
            },
            'sign_det': {},
        }
    };

    report_pdf(report_data);
}
