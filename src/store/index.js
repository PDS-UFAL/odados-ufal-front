import Vue from 'vue';
import Vuex from 'vuex';

import Auth from './auth';
import Alert from './alert';
import Forms from './forms';
import Answers from './answers';
import Sectors from './sectors';
import Questions from './questions';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Auth,
    Alert,
    Forms,
    Answers,
    Sectors,
    Questions,
  },
});

store.dispatch('retrieveAuthToken');
store.dispatch('retrieveUser');

export default store;
