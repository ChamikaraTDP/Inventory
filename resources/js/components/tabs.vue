<template>
    <div>
        <div class="tabs is-centered">
            <ul>
                <li v-for="tab of tabs" :class="{ 'is-active' : current_tab === tab }" :key="tab">
                    <a @click="select_tab(tab)">{{ tab }}</a>
                </li>
            </ul>
        </div>

        <component :is="current_tab_component"></component>

    </div>
</template>

<script>
import tab_users from './tab_users.vue';

export default {
    components: {
        tab_users,
    },

    data() {
        return {
            tabs: ['Users', 'Stations', 'Categories', 'Items'],
            current_tab: 'Users',
        };
    },

    methods: {
        select_tab(selected_tab) {
            this.current_tab = selected_tab;
        }
    },

    computed: {
        current_tab_component() {
            return "tab_" + this.current_tab.toLowerCase();
        }
    },
};
</script>
