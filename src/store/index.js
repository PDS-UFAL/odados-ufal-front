import Vue from 'vue';
import Vuex from 'vuex';

import Auth from './auth';
import Alert from './alert';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Auth,
    Alert,
  },
});

store.dispatch('retrieveAuthToken');
store.dispatch('retrieveUser');

export default store;
