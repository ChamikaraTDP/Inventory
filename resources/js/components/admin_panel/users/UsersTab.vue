<template>
    <div>
        <div class="level">
            <div class="level-left"></div>
            <div class="level-right">
                <div style="margin-right: 4rem" class="level-item">
                    <button class="button is-link is-small" type="button" @click="show_user_form">
                        <span class="icon is-small">
                            <i class="fas fa-plus"></i>
                        </span>
                        <span>Add New User</span>
                    </button>
                </div>
            </div>
        </div>
        <table class="table is-hoverable is-fullwidth is-bordered">
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
                @remove="confirm_rmv"
                @edit="edit_user"
            ></user-row>
            </tbody>
        </table>

        <user-edit-model :user="model_user"
                         :stations="details.stations"
                         v-if="show_model"
                         @close="show_model = false"
                         @edited="submit_user"/>

        <user-create-model :user="model_user"
                           :stations="details.stations"
                           v-if="show_form"
                           @close="show_form = false"
                           @create="create_user"/>

        <slot-model v-show="show_loading" @close="show_loading = false">
            <div class="level">
                <div class="level-left">
                    <div class="level-item">
                        <figure class="image is-128x128">
                            <img src="/images/loading.gif" alt="loading spinner">
                        </figure>
                    </div>
                    <div class="level-item">
                        <span>Please wait...</span>
                    </div>
                </div>
                <div class="level-right"></div>
            </div>
        </slot-model>

        <confirm-model :resource="model_user"
                       v-if="show_confirm"
                       @close="show_confirm = false"
                       @confirm="remove_user"/>
    </div>
</template>

<script>
import axios from 'axios';
import { cloneDeep } from 'lodash';

import UserRow from './UserRow';
import UserEditModel from './UserEditModel';
import SlotModel from '../../SlotModel';
import ConfirmModel from '../../ConfirmModel';
import UserCreateModel from './UserCreateModel';


export default
{
    components: {
        UserCreateModel,
        'user-row': UserRow,
        'user-edit-model': UserEditModel,
        'slot-model': SlotModel,
        'confirm-model': ConfirmModel,
    },

    props: ['details'],

    data() {
        return {
            show_model: false,
            show_loading: false,
            show_confirm: false,
            show_form: false,
            model_user: {},
        };
    },

    methods: {
        create_user(user) {
            this.show_form = false;
            this.show_loading = true;

            axios.post('/inventory/users/create', user)
                .then( () => {
                    this.details.users.push(user);
                    this.show_loading = false;
                })
                .catch(error => {
                    console.error('Error occurred while creating the user: ' + error.message);
                });
        },

        show_user_form() {
            this.model_user = {
                name: '',
                username: '',
                user_type: '',
                station_id: 0,
                password: '',
            };
            this.show_form = true;
        },

        confirm_rmv(user) {
            this.model_user = user;
            this.show_confirm = true;
        },

        remove_user(user_id) {
            this.show_confirm = false;
            this.show_loading = true;

            axios.delete(`/inventory/users/delete?id=${ user_id }`)
                .then( () => {
                    if( window.get_user().id === user_id ) {
                        document.getElementById('logout-form').submit();
                    }
                    else {
                        this.details.users = this.details.users.filter(user => {
                            return user.id != user_id;
                        });

                        this.show_loading = false;
                    }
                })
                .catch(error => {
                    console.error('Error occurred while deleting the user: ' + error.message);
                });

        },

        edit_user(user) {
            this.model_user = cloneDeep(user);
            this.show_model = true;
        },

        submit_user(user) {
            this.show_model = false;
            this.show_loading = true;

            let users = this.details.users;

            axios.patch('/inventory/users/update', user)
                .then( () => {
                    if( window.get_user().id === user.id ) {
                        document.getElementById('logout-form').submit();
                    }
                    else {

                        let user_index = users.findIndex(old_user => {
                            return old_user.id === user.id;
                        });

                        users[user_index] = user;
                        this.show_loading = false;

                    }
                })
                .catch(error => {
                    console.error('Error occurred while updating the user: ' + error.message);
                });
        },
    },

};
</script>
