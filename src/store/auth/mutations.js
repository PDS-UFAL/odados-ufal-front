import TYPES from '../types';

import setLocal from '../../utils/storage';

export default {
  [TYPES.SET_TOKEN](state, token) {
    state.token = token;
    setLocal('authToken', token);
  },
  [TYPES.SET_USER](state, user) {
    state.user = user;
    setLocal('user', JSON.stringify(user));
  },
};
