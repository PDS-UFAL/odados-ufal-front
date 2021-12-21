import TYPES from '../types';
import window from 'global/window';
import authApi from '@/api/auth';

export default {
  async executeLogin(store, { payload }) {
    return await authApi.executeLogin(payload);
  },
  async setAuthToken({ commit }, { token }) {
    commit(TYPES.SET_TOKEN, token);
  },
  async setUser({ commit }, { user }) {
    commit(TYPES.SET_USER, user);
  },
  retrieveAuthToken({ commit }) {
    if (window.localStorage) {
      commit(TYPES.SET_TOKEN, window.localStorage.getItem('authToken'));
    }
  },
  retrieveUser({ commit }) {
    if (window.localStorage) {
      commit(TYPES.SET_USER, JSON.parse(window.localStorage.getItem('user')));
    }
  },
};
