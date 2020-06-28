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
                        <span>Add New Station</span>
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
            <station-row
                v-for="station of stations"
                :station="station"
                :key="station.id"
                @remove="confirm_rmv"
                @edit="edit"/>
            </tbody>
        </table>

        <station-edit-model :station="model"
                         v-if="show_model"
                         @close="show_model = false"
                         @edited="submit"/>

        <station-create-model :station="model"
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

import StationRow from './StationRow';
import SlotModel from '../../SlotModel';
import ConfirmModel from '../../ConfirmModel';
import StationEditModel from './StationEditModel';
import StationCreateModel from './StationCreateModel';


export default
{
    components: {
        StationCreateModel,
        StationRow,
        SlotModel,
        ConfirmModel,
        StationEditModel,
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
            stations: [],
            error_text: 'Cannot remove the station because it has some registered users!',
        };
    },

    created() {
        this.stations = this.details.filter(stn => {
            return stn.id !== 1;
        });
    },

    methods: {
        create(station) {
            this.show_form = false;
            this.show_loading = true;

            axios.post('/stations', station)
                .then( () => {
                    this.stations.push(station);
                    this.show_loading = false;
                })
                .catch(error => {
                    console.error('Error occurred while creating the station: ' + error.message);
                });
        },

        toggle_form() {
            this.model = {
                name: '',
            };
            this.show_form = true;
        },

        confirm_rmv(station) {
            this.model = station;
            this.show_confirm = true;
        },

        remove(station_id) {
            this.show_confirm = false;
            this.show_loading = true;

            axios.delete(`/stations/${ station_id }`)
                .then( () => {
                    this.stations = this.stations.filter(station => {
                        return station.id != station_id;
                    });

                    this.show_loading = false;
                })
                .catch(error => {
                    if(error.response.status === 500) {
                        this.show_loading = false;
                        this.show_error = true;
                    }
                    else {
                        console.error('Error occurred while deleting the station: ' + error.message);
                    }
                });

        },

        edit(station) {
            this.model = cloneDeep(station);
            this.show_model = true;
        },

        submit(station) {
            this.show_model = false;
            this.show_loading = true;

            let stations = this.stations;

            axios.patch(`/stations/${ station.id }`, station)
                .then( () => {
                    let station_index = stations.findIndex(old_station => {
                        return old_station.id === station.id;
                    });

                    stations[station_index] = station;
                    this.show_loading = false;
                })
                .catch(error => {
                    console.error('Error occurred while updating the station: ' + error.message);
                });
        },
    },

};
</script>
