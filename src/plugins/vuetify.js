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
        'grey-1': '#353B42',
      },
    },
  },
};

export default new Vuetify(opts);
