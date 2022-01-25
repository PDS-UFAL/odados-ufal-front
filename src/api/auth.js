import request from './request';

const resource = '/api/login';
export default {
  executeLogin(payload) {
    return request.$http.post(`${resource}`, payload);
  },
};
