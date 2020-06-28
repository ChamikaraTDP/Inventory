<template>
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="card">
                <header class="card-header">
                    <div class="card-header-title is-centered">Edit Item</div>
                </header>

                <div class="card-content">
                    <form method="POST" @submit.prevent="create">
                        <div class="field">
                            <label class="label" for="name">Name</label>

                            <div class="control">
                                <input id="name"
                                       type="text"
                                       class="input"
                                       name="name"
                                       v-model="item.name"
                                       maxlength="255"
                                       autocomplete="name"
                                       pattern="^(?=.*[A-Za-z]).*$"
                                       title="should contain some letters"
                                       required autofocus>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Category</label>
                            <div class="control">
                                <div class="select">
                                    <select name="category"
                                            v-model="item.category_id"
                                            @change="change_category"
                                            required>
                                        <option :value="category.id"
                                                v-for="category of categories"
                                                :key="category.id">
                                            {{ category.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Item Type</label>
                            <div class="control">
                                <label class="radio">
                                    <input type="radio" name="type" value=1 v-model="item.type" required>
                                    Inventory
                                </label>
                                <label class="radio">
                                    <input type="radio" name="type" v-model="item.type" value=0>
                                    Bulk
                                </label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="control">
                                <button type="submit" class="button is-link">
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="$emit('close')"></button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['categories', 'item'],

    methods: {
        create() {
            this.$emit('create', this.item);
        },

        change_category() {
            this.item.category =  this.categories.find( category => {
                return category.id === this.item.category_id;
            });
        },
    },

};
</script>
