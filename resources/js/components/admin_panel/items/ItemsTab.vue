<template>
    <div>
        <div class="level">
            <div class="level-left"></div>
            <div class="level-right">
                <div style="margin-right: 4rem" class="level-item">
                    <button class="button is-link is-small" type="button" @click="toggle_form">
                        <span class="icon is-small">
                            <i class="fas fa-plus"></i>
                        </span>
                        <span>Add New Item</span>
                    </button>
                </div>
            </div>
        </div>
        <table class="table is-hoverable is-fullwidth is-bordered">
            <thead>
            <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Type</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <item-row
                v-for="item of items"
                :item="item"
                :key="item.id"
                @remove="confirm_rmv"
                @edit="edit"/>
            </tbody>
        </table>

        <item-edit-model :item="model"
                         :categories="categories"
                         v-if="show_model"
                         @close="show_model = false"
                         @edited="submit"/>

        <item-create-model :item="model"
                           :categories="categories"
                           v-if="show_form"
                           @close="show_form = false"
                           @create="create"/>

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

        <confirm-model :resource="model"
                       v-if="show_confirm"
                       @close="show_confirm = false"
                       @confirm="remove"/>

        <slot-model v-show="show_error" @close="show_error = false">
            <h6 class="subtitle is-6">{{ error_text }}</h6>
        </slot-model>
    </div>
</template>

<script>
import axios from 'axios';
import { cloneDeep } from 'lodash';

import ItemRow from './ItemRow';
import SlotModel from '../../SlotModel';
import ConfirmModel from '../../ConfirmModel';
import ItemEditModel from './ItemEditModel';
import ItemCreateModel from './ItemCreateModel';


export default
{
    components: {
        ItemCreateModel,
        ItemRow,
        SlotModel,
        ConfirmModel,
        ItemEditModel,
    },

    props: ['details'],

    data() {
        return {
            show_model: false,
            show_loading: false,
            show_confirm: false,
            show_form: false,
            show_error: false,
            model: {},
            items: [],
            categories: [],
            error_text: 'Cannot remove the item because it has some registered transactions!',
        };
    },

    created() {
        this.items = this.details;
        this.items = this.details.items;
        this.categories = this.details.categories;
    },

    methods: {
        create(item) {
            this.show_form = false;
            this.show_loading = true;

            axios.post('/items', item)
                .then( () => {
                    this.items.push(item);
                    this.show_loading = false;
                })
                .catch(error => {
                    console.error('Error occurred while creating the item: ' + error.message);
                });
        },

        toggle_form() {
            this.model = {
                name: '',
                category_id: 0,
                type: 0,
                category: {},
            };
            this.show_form = true;
        },

        confirm_rmv(item) {
            this.model = item;
            this.show_confirm = true;
        },

        remove(item_id) {
            this.show_confirm = false;
            this.show_loading = true;

            axios.delete(`/items/${ item_id }`)
                .then( () => {
                    this.items = this.items.filter(item => {
                        return item.id != item_id;
                    });

                    this.show_loading = false;
                })
                .catch(error => {
                    if(error.response.status === 500) {
                        this.show_loading = false;
                        this.show_error = true;
                    }
                    else {
                        console.error('Error occurred while deleting the item: ' + error.message);
                    }
                });

        },

        edit(item) {
            this.model = cloneDeep(item);
            this.show_model = true;
        },

        submit(item) {
            this.show_model = false;
            this.show_loading = true;

            let items = this.items;

            axios.patch(`/items/${ item.id }`, item)
                .then( () => {
                    let item_index = items.findIndex(old_item => {
                        return old_item.id === item.id;
                    });

                    items[item_index] = item;
                    this.show_loading = false;
                })
                .catch(error => {
                    console.error('Error occurred while updating the category: ' + error.message);
                });
        },
    },

};
</script>
