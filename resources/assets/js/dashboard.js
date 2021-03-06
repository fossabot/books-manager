import Vue from 'vue';
import Storage from 'vue-ls';
import Notifications from 'vue-notification';
import Datatable from 'vue2-datatable-component';

Vue.use(Storage);
Vue.use(Notifications);
Vue.use(Datatable);

import '../scss/dashboard.scss';
import tablePanel from './components/tablePanel.vue';

new Vue({
    el: '#content',
    components: { tablePanel },
    template: '<tablePanel />',
});
