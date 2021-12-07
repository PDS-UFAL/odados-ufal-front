import TYPES from '../types';
import window from 'global/window';
import authApi from '@/api/auth';

export default {
  async executeLogin(store, { payload }) {
    return await authApi.executeLogin(payload);
  },
  async setAuthToken({ commit }, { token }) {
    if (!token) return;
    commit(TYPES.SET_TOKEN, token);
  },
  async setUser({ commit }, { user }) {
    if (!user) return;
    commit(TYPES.SET_USER, user);
  },
  retriveAuthToken({ commit }) {
    if (window.localStorage) {
      commit(TYPES.SET_TOKEN, window.localStorage.getItem('authToken'));
    }
  },
};
