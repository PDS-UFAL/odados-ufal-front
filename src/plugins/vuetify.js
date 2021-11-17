import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

const opts = {
  customVariables: ['~/assets/variables.scss'],
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#0098DA',
        'snow-white': '#F8F9FA',
        'grey-1': '#353B42',
        'green-1': '#6AD90B',
        'red-1': '#D91636',
        'yellow-1': '#D9D016',
      },
    },
  },
};

export default new Vuetify(opts);
