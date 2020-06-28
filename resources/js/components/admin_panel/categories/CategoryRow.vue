<template>
    <tr>
        <td>{{ category.name }}</td>
        <td>
            <button class="button is-small is-outlined" @click="edit">Edit</button>
            <button class="button is-small is-danger is-outlined" @click="remove">Remove</button>
        </td>
    </tr>
</template>

<script>
export default {
    props: ['category'],

    methods: {
        edit() {
            this.$emit('edit', this.category);
        },

        remove() {
            this.$emit('remove', this.category);
        },
    },
};
</script>
