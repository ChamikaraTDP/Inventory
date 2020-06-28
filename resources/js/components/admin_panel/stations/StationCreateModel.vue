<template>
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="card">
                <header class="card-header">
                    <div class="card-header-title is-centered">Create New Station</div>
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
                                       v-model="station.name"
                                       maxlength="255"
                                       autocomplete="name"
                                       pattern="^(?=.*[A-Za-z]).*$"
                                       title="should contain some letters"
                                       required autofocus>
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

        </div>
        <button class="modal-close is-large" aria-label="close" @click="$emit('close')"></button>
    </div>
</template>

<script>
export default {
    props: ['station'],

    methods: {
        create() {
            this.$emit('create', this.station);
        }
    },

};
</script>
