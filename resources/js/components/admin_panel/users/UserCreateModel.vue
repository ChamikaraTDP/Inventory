<template>
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="card">
                <header class="card-header">
                    <div class="card-header-title is-centered">Create New User</div>
                </header>

                <div class="card-content">
                    <form method="POST" @submit.prevent="create_user">
                        <div class="field">
                            <label class="label" for="name">Name</label>

                            <div class="control">
                                <input id="name"
                                       type="text"
                                       class="input"
                                       name="name"
                                       v-model="user.name"
                                       maxlength="255"
                                       autocomplete="name"
                                       pattern="^(?=.*[A-Za-z]).*$"
                                       title="should contain some letters"
                                       required autofocus>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label" for="branch">Station</label>

                            <div class="control">
                                <div class="select">
                                    <select id="branch" v-model="user.station_id" @change="change_station" required>
                                        <option disabled value="">Select Station</option>

                                        <option v-for="station of stations"
                                                :value="station.id"
                                                :key="station.id"
                                                :selected="user.station_id === station.id">
                                            {{ station.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label" for="name">User Type</label>

                            <div class="control">
                                <div class="select">
                                    <select id="user_type" v-model="user.user_type" required>
                                        <option disabled value="">Select User Type</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label for="username" class="label">Username</label>

                            <div class="control">
                                <input id="username"
                                       type="text"
                                       class="input"
                                       name="username"
                                       v-model="user.username"
                                       pattern="[\w]+"
                                       title="may contain letters and numbers,
                                            Minimum 4 characters, Maximum 20 characters."
                                       autocomplete="username"
                                       minlength="4" maxlength="20"
                                       autofocus required>

                            </div>
                        </div>

                        <div class="field">
                            <label for="password" class="label">Password</label>

                            <div class="control">
                                <input id="password" type="password"
                                       class="input"
                                       name="password"
                                       v-model="user.password"
                                       minlength="8"
                                       maxlength="255"
                                       autocomplete="new-password"
                                       pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}$"
                                       title="Should contain minimum 8 characters,
                                            Uppercase and Lowercase characters and numbers."
                                       required>

                            </div>
                        </div>

                        <!--<div class="field">
                            <label for="password-confirm" class="label">Confirm Password</label>

                            <div class="control">
                                <input id="password-confirm"
                                       type="password"
                                       class="input"
                                       name="password_confirmation"
                                       placeholder="Leave blank if not to change"
                                       autocomplete="new-password"
                                       minlength="8"
                                       maxlength="255"
                                       pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}$"
                                       title="Should contain minimum 8 characters,
                                            Uppercase and Lowercase characters and numbers.">
                            </div>
                        </div>-->

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
    props: ['user', 'stations'],

    methods: {
        create_user() {
            this.$emit('create', this.user);
        },

        change_station() {
            let ustn_id = this.user.station_id;
            this.user.station =  this.stations.find(function(station) {
                return station.id === ustn_id;
            });
        },
    },

};
</script>
