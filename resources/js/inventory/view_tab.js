import Vue from 'vue';
import { display_model as isu_model, create_pdf as isu_pdf } from './issue_tab';
import { display_model as rcv_model, create_pdf as rcv_pdf } from './add_tab';
import { debounce } from 'lodash';
import axios from 'axios';

export { init_view_tab };


function init_view_tab(data) {
    let view_app = new Vue({
        el: '#app_view',

        data: {
            'trans': data,
            'u_stn': (window.get_user_station() ).id,
        },
    });

    init_tran_tabs(view_app);

    document.getElementById('search_box').addEventListener('input', function(event) {
        debounced_search(event.target.value, view_app);
    });

}


function init_tran_tabs(view_app) {
    const tabs = document.querySelectorAll("#tran_tabs>li");

    tabs[0].addEventListener('click', function() {
        toggle_selection(tabs, tabs[0]);
        fetch_all(view_app);
    });

    tabs[1].addEventListener('click', function() {
        toggle_selection(tabs, tabs[1]);
        fetch_receipts(view_app);
    });

    tabs[2].addEventListener('click', function() {
        toggle_selection(tabs, tabs[2]);
        fetch_issues(view_app);
    });
}


function toggle_selection(tabs, selected) {
    tabs.forEach( function(tab) {
        tab.classList.toggle('is-active', tab === selected);
    });
}


function fetch_all(view_app) {
    axios.get(`/inventory/tab/view/all`)
        .then(response => {
            view_app.trans = response.data;
        })
        .catch(error => {
            console.error('There has been a problem with your request:', error.message);
        });
}


function fetch_receipts(view_app) {
    fetch(`/inventory/tab/view/receipts`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(trans => {
            view_app.trans = trans;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}


function fetch_issues(view_app) {
    fetch(`/inventory/tab/view/issues`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(trans => {
            view_app.trans = trans;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}


Vue.component('transactions', {
    props: ['trans', 'u_stn'],

    template: `
        <div>
            <transaction v-for="tran in trans"
                :record="tran"
                :u_stn="u_stn"
                :key="tran.id"
            ></transaction>
        </div>`,
});


Vue.component('transaction', {
    props: ['record', 'u_stn'],

    computed: {
        isIssue() {
            return this.record.isu_stn_id === this.u_stn;
        },
    },

    methods: {
        get_itm_info() {
            const transac = this.record;

            if(transac.type === 'to_stock') {
                handle_stock_receipt(transac);
            }
            else if(this.isIssue) {
                handle_station_issue(transac);
            }
            else {
                handle_station_receipt(transac);
            }
        }

    },

    template: `
        <article class="media max_width_100">
            <div class="media-left" v-if="isIssue">
                <span class="tag is-large is-warning is-rounded"><span class="icon">I</span></span>
            </div>
            <div class="media-left" v-else>
                <span class="tag is-large is-link is-rounded"><span class="icon">R</span></span>
            </div>
            <div class="media-content min_width_0">
                <nav style="margin-bottom: 1rem" class="level">
                    <div class="level-left">
                        <span class="level-item">
                            <span class="tag is-white is-medium">Transaction ID :</span>
                        </span>
                        <span class="level-item">
                            <span class="tag is-medium is-rounded">{{ record.id }}</span>
                        </span>
                    </div>
                    <div class="level-right">
                        <span class="level-item">
                            <span class="tags are-medium has-addons">
                                <span class="tag" v-if="isIssue">Issued On :</span>
                                <span class="tag" v-else>Received On :</span>
                                <span class="tag is-primary">{{ record.isu_date }}</span>
                            </span>
                        </span>
                    </div>
                </nav>
                <div class="level min_width_0">
                    <div class="level-left">
                        <div class="level-item tags are-medium">                        
                            <template v-if="isIssue">
                                <span class="tag is-white">Issued To :</span>
                                <span class="tag is-info is-rounded">
                                    {{ record.rcv_stn }}
                                </span>
                            </template>                            
                            <template v-else>
                                <span class="tag is-white">Received From :</span>
                                <span class="tag is-info is-rounded" 
                                  v-if="record.type === 'to_stock'">
                                    {{ record.sup }}
                                </span>
                                <span class="tag is-info is-rounded" v-else>
                                    {{ record.isu_stn }}
                                </span>
                            </template>
                        </div>                        
                    </div>
                    <div style="max-width: 50%" class="level-right min_width_0">
                        <div class="level-item max_width_100 min_width_0">
                            <p class="text_ellipsis">{{ record.des }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="media-right">
                <button class="button is-medium" v-on:click="get_itm_info">
                    <span class="icon">
                        <i class="fas fa-eye"></i>
                    </span>
                </button>
            </div>
        </article>`,
});


function handle_station_issue(transac) {
    fetch(`/inventory/transaction/${ transac.id }`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(items => {
            const isu_list = {
                'items': items,

                'model_details': {
                    'heading': `Issue Note`,
                    'top_left': {
                        'Issued Station' : transac.isu_stn,
                        'Received Station' : transac.rcv_stn,
                        'Received Officer' : transac.rcv_usr,
                    },
                    'top_right': {
                        'tran_det': `Transaction ID : ${ transac.id }`,
                    },
                    'bottom_left': {
                        'description': `Description: ${ transac.des ? transac.des : 'not provided'}`,
                        'Issue note': `Issued on ${ transac.isu_date } and the issue duly entered.`,
                    },
                    'sign_det': {
                        'dots': '.............................................',
                        'sign_usr_name': transac.isu_usr,
                        'sign_note': `(Issuing Officer)`,
                    },
                    'btn_text': `Download PDF`,
                },
            };

            const isu_mdl = document.getElementById('isu_mdl');

            isu_model(isu_mdl, isu_list, function(i_mdl, i_list) {
                isu_pdf(i_list);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}


function handle_stock_receipt(transac) {
    fetch(`/inventory/transaction/stock/${ transac.id }`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(items => {
            const isu_list = {
                'items': items,

                'model_details': {
                    'heading': `Stock Note`,
                    'top_left': [
                        `Date : ${ transac.isu_date }`,
                        `Received from : ${ transac.sup }`,
                        `Issue Note no : ${ transac.rcp_no }`,
                    ],
                    'bottom_note': `Above items are recorded in the inventory.`,
                    'description': `Description: ${ transac.des ? transac.des : 'not provided' }`,
                    'sign_note': `(Stock Officer)`,
                    'sign_usr_name' : transac.rcv_usr,
                    'btn_text' : `Download PDF`,
                    'tran_det': `Transaction ID : ${ transac.id }`,
                },
            };

            const isu_mdl = document.getElementById('isu_mdl');

            rcv_model(isu_mdl, isu_list, function(i_mdl, i_list) {
                rcv_pdf(i_list);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function handle_station_receipt(transac) {
    axios.get(`/inventory/transaction/${ transac.id }`)
        .then(response => {
            const isu_list = {
                'items': response.data,

                'model_details': {
                    'heading': `Receipt`,
                    'top_left': {
                        'Received Station' : transac.rcv_stn,
                        'Issued Station' : transac.isu_stn,
                        'Issued Officer' : transac.isu_usr,
                    },
                    'top_right': {
                        'tran_det': `Transaction ID : ${ transac.id }`,
                    },
                    'bottom_left': {
                        'description': `Description: ${ transac.des ? transac.des : 'not provided' }`,
                        'Issue note': `Received on ${ transac.isu_date } and the receipt duly entered.`,
                    },
                    'sign_det': {
                        'dots': '.............................................',
                        'sign_usr_name': transac.rcv_usr,
                        'sign_note': `(Receiving Officer)`,
                    },
                    'btn_text': `Download PDF`,
                },
            };

            const isu_mdl = document.getElementById('isu_mdl');

            isu_model(isu_mdl, isu_list, function(i_mdl, i_list) {
                isu_pdf(i_list);
            });
        })
        .catch(error => {
            console.error('Error occurred while fetching transaction details:', error.message);
        });

}

const debounced_search = debounce(search_trans, 600);

function search_trans(phase, view_app) {
    fetch(`/inventory/transaction/search?phase=${ phase }&stn=${ view_app.u_stn }`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(trans => {
            view_app.trans = trans;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}
