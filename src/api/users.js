import request from './request';

//const resource = '/api/users/forgot_password';
export default {
  forgotPassword(payload) {
    return request.$http.post(`${'/api/users/forgot_password'}`, payload);
  },
  resetPassword(payload) {
    return request.$http.put(`${'/api/users/reset_password'}`, payload);
  },
  createUser(payload) {
    return request.$http.post(`${'/api/users'}`, payload);
  },
};
