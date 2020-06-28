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
                        <span>Add New Category</span>
                    </button>
                </div>
            </div>
        </div>
        <table class="table is-hoverable is-fullwidth is-bordered">
            <thead>
            <tr>
                <th>Name</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <category-row
                v-for="category of categories"
                :category="category"
                :key="category.id"
                @remove="confirm_rmv"
                @edit="edit"/>
            </tbody>
        </table>

        <category-edit-model :category="model"
                         v-if="show_model"
                         @close="show_model = false"
                         @edited="submit"/>

        <category-create-model :category="model"
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

import CategoryRow from './CategoryRow';
import SlotModel from '../../SlotModel';
import ConfirmModel from '../../ConfirmModel';
import CategoryEditModel from './CategoryEditModel';
import CategoryCreateModel from './CategoryCreateModel';


export default
{
    components: {
        CategoryCreateModel,
        CategoryRow,
        SlotModel,
        ConfirmModel,
        CategoryEditModel,
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
            categories: [],
            error_text: 'Cannot remove the category because it has some registered items!',
        };
    },

    created() {
        this.categories = this.details;
    },

    methods: {
        create(category) {
            this.show_form = false;
            this.show_loading = true;

            axios.post('/categories', category)
                .then( () => {
                    this.categories.push(category);
                    this.show_loading = false;
                })
                .catch(error => {
                    console.error('Error occurred while creating the category: ' + error.message);
                });
        },

        toggle_form() {
            this.model = {
                name: '',
            };
            this.show_form = true;
        },

        confirm_rmv(category) {
            this.model = category;
            this.show_confirm = true;
        },

        remove(category_id) {
            this.show_confirm = false;
            this.show_loading = true;

            axios.delete(`/categories/${ category_id }`)
                .then( () => {
                    this.categories = this.categories.filter(category => {
                        return category.id != category_id;
                    });

                    this.show_loading = false;
                })
                .catch(error => {
                    if(error.response.status === 500) {
                        this.show_loading = false;
                        this.show_error = true;
                    }
                    else {
                        console.error('Error occurred while deleting the category: ' + error.message);
                    }
                });

        },

        edit(category) {
            this.model = cloneDeep(category);
            this.show_model = true;
        },

        submit(category) {
            this.show_model = false;
            this.show_loading = true;

            let categories = this.categories;

            axios.patch(`/categories/${ category.id }`, category)
                .then( () => {
                    let category_index = categories.findIndex(old_category => {
                        return old_category.id === category.id;
                    });

                    categories[category_index] = category;
                    this.show_loading = false;
                })
                .catch(error => {
                    console.error('Error occurred while updating the category: ' + error.message);
                });
        },
    },

};
</script>
