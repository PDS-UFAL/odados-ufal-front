import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from '@/plugins/vuetify.js';
import '@mdi/font/css/materialdesignicons.css';
import VueApexCharts from '@revolist/vue-datagrid';
import { defineCustomElements } from '@revolist/revogrid/loader';
import { HalfCircleSpinner } from '../node_modules/epic-spinners';

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

defineCustomElements();
Vue.config.productionTip = false;
Vue.config.ignoredElements = [/revo-\w*/];

Vue.use(VueApexCharts);
Vue.use(HalfCircleSpinner);

Vue.component('apexchart', VueApexCharts);
Vue.component('circle-spinner', HalfCircleSpinner);
