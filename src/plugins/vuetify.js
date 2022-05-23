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
        green: '#6AD90B',
        red: '#D91636',
        yellow: '#D9D016',
        background: '#f4f5f7',
        'snow-white': '#F8F9FA',
        'cloudy-grey': '#353B42',
        'muddy-grey': '#666666',
      },
    },
  },
};

export default new Vuetify(opts);
