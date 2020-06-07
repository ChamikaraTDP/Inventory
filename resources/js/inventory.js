import { tab_selection as tab } from './inventory/navigation';
import Echo from 'laravel-echo';


window.Pusher = require('pusher-js');

window.tab_selection = tab;

window.Ech0 = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    //encrypted: false,
    wsHost: window.location.hostname,
    wsPort: 6001,
});
