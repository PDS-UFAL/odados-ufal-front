import Vue from 'vue';
import Vuex from 'vuex';

import Auth from './auth';
import Alert from './alert';
import Forms from './forms';
import FormResults from './form_results';
import FormSends from './form_sends';
import Answers from './answers';
import Sectors from './sectors';
import Questions from './questions';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Auth,
    Alert,
    Forms,
    FormSends,
    FormResults,
    Answers,
    Sectors,
    Questions,
  },
});

store.dispatch('retrieveAuthToken');
store.dispatch('retrieveUser');

export default store;
