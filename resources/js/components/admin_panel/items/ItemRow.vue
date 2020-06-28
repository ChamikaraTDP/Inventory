<template>
    <tr>
        <td>{{ item.name }}</td>
        <td>{{ item.category.name }}</td>
        <td>{{ item_type }}</td>
        <td>
            <button class="button is-small is-outlined" @click="edit">Edit</button>
            <button class="button is-small is-danger is-outlined" @click="remove">Remove</button>
        </td>
    </tr>
</template>

<script>
export default {
    props: ['item'],

    methods: {
        edit() {
            this.$emit('edit', this.item);
        },

        remove() {
            this.$emit('remove', this.item);
        },
    },

    computed: {
        item_type() {
            return this.item.type ? 'Inventory': 'Bulk';
        }
    },
};
</script>
