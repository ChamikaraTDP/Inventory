import Vue from 'vue';
export { init_view_tab };


function init_view_tab(data) {

    let view_app = new Vue({
        el: '#app_view',
        data: {
            'trans': data,
        },
    });

    init_tran_tabs(view_app);
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
    fetch('/inventory/tab/view/all')
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


function fetch_receipts(view_app) {
    fetch('/inventory/tab/view/receipts')
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
    fetch('/inventory/tab/view/issues')
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
    data() {
        return {
            'u_stn': ( window.get_user_station() ).id,
        };
    },

    props: ['trans'],

    template: `
        <div>
            <transaction v-for="tran in trans"
                v-bind:record="tran"
                v-bind:u_stn="u_stn"
                v-bind:key="tran.id"
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

    template: `
        <article class="media">
            <div class="media-left" v-if="isIssue">
                <span class="tag is-large is-warning is-rounded"><span class="icon">I</span></span>
            </div>
            <div class="media-left" v-else>
                <span class="tag is-large is-link is-rounded"><span class="icon">R</span></span>
            </div>
            <div class="media-content">
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
                <div class="content">
                    <div class="tags are-medium">                        
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
            </div>
            <div class="media-right">
                <button class="button is-medium">
                    <span class="icon">
                        <i class="fas fa-eye"></i>
                    </span>
                </button>
            </div>
        </article>`,
});
