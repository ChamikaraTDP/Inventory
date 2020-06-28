import Vue from 'vue';
import UsersTab from '../components/admin_panel/users/UsersTab';
import StationsTab from '../components/admin_panel/stations/StationsTab';
import CategoriesTab from '../components/admin_panel/categories/CategoriesTab';
import axios from  'axios';
import ItemsTab from '../components/admin_panel/items/ItemsTab';


Vue.component('tabs', function(resolve, reject) {
    axios.get('/inventory/admin/get')
        .then(response => {
            resolve({
                components: {
                    'tab-users': UsersTab,
                    'tab-stations': StationsTab,
                    'tab-categories': CategoriesTab,
                    'tab-items': ItemsTab,
                },

                template: `
                    <div>
                        <div class="tabs is-centered">
                            <ul>
                                <li v-for="tab of tabs" :class="{ 'is-active' : current_tab === tab }">
                                    <a @click="select_tab(tab)">{{ tab }}</a>
                                </li>
                            </ul>
                        </div>
            
                        <keep-alive>
                            <component :is="current_tab_component" :details="tab_data"></component>
                        </keep-alive>
            
                    </div>`,

                data() {
                    return {
                        tabs: ['Users','Stations', 'Categories', 'Items'],
                        current_tab: 'Users',
                        Stations: response.data.stations,
                        Categories: response.data.categories,
                        item_tab: response.data.items,
                        user_tab: response.data.users,
                        Users: {},
                        Items: {},

                    };
                },

                methods: {
                    select_tab(selected_tab)  {
                        this.current_tab = selected_tab;
                    }
                },

                created() {
                    this.Users = {
                        users: this.user_tab,
                        stations: this.Stations,
                    };

                    this.Items = {
                        items: this.item_tab,
                        categories: this.Categories,
                    };
                },

                computed: {
                    current_tab_component() {
                        return "tab-" + this.current_tab.toLowerCase();
                    },

                    tab_data() {
                        let current = this.current_tab;
                        return this[current];
                    },
                },

            });

            document.getElementById('spinner').style.display = 'none';

        })
        .catch(error => {
            reject('get request for users failed!');
            console.error('There has been a problem with your get_add request:', error.message);
        });

});


new Vue({
    el: '#root',
});


/*Vue.component('tab-users', {
    components: {
        'user-row': UserRow,
        'user-edit-model': UserEditModel,
        'slot-model': SlotModel,
    },

    template: `
        <div>
            <table class="table is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Station</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <user-row
                        v-for="user of details.users"
                        :user="user"
                        :key="user.id"
                        @remove="remove_user"
                        @edit="edit_user"
                    ></user-row>
                </tbody>
            </table>

            <user-edit-model :user="model_user"
                :stations="details.stations"
                v-if="show_model"
                @close="show_model = false"
                @edited="submit_user"></user-edit-model>

            <slot-model v-show="show_loading" @close="show_loading = false">
                <figure class="image is-128x128">
                    <img src="/images/loading.gif" alt="loading spinner">
                </figure>
                <span>Please wait...</span>
            </slot-model>
        </div>`,

    props: ['details'],

    data() {
        return {
            show_model: false,
            show_loading: false,
            show_success: false,
        };
    },

    methods: {
        remove_user(user_id) {
            this.users = this.users.filter(function(user) {
                return user.id != user_id;
            });
            console.log('user ' + user_id + ' removed!');
        },

        edit_user(user) {
            this.model_user = cloneDeep(user);
            this.show_model = true;
        },

        submit_user(user) {
            this.show_model = false;
            this.show_loading = true;

            axios.patch('/inventory/users/update', user)
                .then( () => {
                    this.show_loading = false;
                })
                .catch(error => {
                    console.error('Error occurred while updating the user ' + error.message());
                });
        },
    },

});*/


/*Vue.component("tab-stations",{
    template: `
        <div>
            <ol>
                <li v-for="station of details">{{ station.name }}</li>
            </ol>
        </div>`,

    props: ['details'],

});*/


/*
Vue.component("tab-categories", {
    template: "<div>Posts component</div>",
});
*/


/*Vue.component("tab-items", {
    template: "<div>Archive component</div>",
});*/
