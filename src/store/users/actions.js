import usersApi from '@/api/users';

export default {
  async forgotPassword(store, { payload }) {
    return await usersApi.forgotPassword(payload);
  },
  async resetPassword(store, { payload }) {
    return await usersApi.resetPassword(payload);
  },
  async getPasswordToken() {
    return await new URLSearchParams(window.location.search).get('token');
  },
};
