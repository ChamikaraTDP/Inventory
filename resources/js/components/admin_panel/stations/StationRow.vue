<template>
    <tr>
        <td>{{ station.name }}</td>
        <td>
            <button class="button is-small is-outlined" @click="edit">Edit</button>
            <button class="button is-small is-danger is-outlined" @click="remove">Remove</button>
        </td>
    </tr>
</template>

<script>
export default {
    props: ['station'],

    methods: {
        edit() {
            this.$emit('edit', this.station);
        },

        remove() {
            this.$emit('remove', this.station);
        },
    },
};
</script>
