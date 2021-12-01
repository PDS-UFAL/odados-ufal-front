import request from './request';

const resource = '/login';
export default {
  executeLogin(payload) {
    return request.$http.post(`${resource}`, payload);
  },
};
