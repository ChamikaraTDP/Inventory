<template>
    <tr>
        <td>{{ user.name }}</td>
        <td>{{ user.station.name }}</td>
        <td>{{ user.user_type }}</td>
        <td>
            <button class="button is-small is-outlined" @click="edit_user">Edit</button>
            <button class="button is-small is-danger is-outlined" @click="remove_user">Remove</button>
        </td>
    </tr>
</template>

<script>
export default {
    props: ['user'],

    methods: {
        edit_user() {
            this.$emit('edit', this.user);
        },

        remove_user() {
            this.$emit('remove', this.user);
        },
    },
};
</script>
