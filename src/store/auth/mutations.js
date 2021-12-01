import TYPES from '../types';

import setLocal from '../../utils/storage';

export default {
  [TYPES.SET_TOKEN](state, token) {
    state.token = token;
    setLocal('authToken', token);
  },
};
