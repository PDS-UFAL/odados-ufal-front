import Vue from 'vue';
import Vuex from 'vuex';

import Auth from './auth';
import Alert from './alert';
import Sectors from './sectors';
import Questions from './questions';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Auth,
    Alert,
    Sectors,
    Questions,
  },
});

store.dispatch('retriveAuthToken');

export default store;
