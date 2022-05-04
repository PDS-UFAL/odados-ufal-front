import request from './request';

const resource = '/api/form_sends';
export default {
  fetchFormSends(options) {
    return request.$http.get(`${resource}`, options);
  },
  fetchFormSend(id) {
    return request.$http.get(`${resource}/${id}`);
  },
  createFormSend(payload) {
    return request.$http.post(`${resource}`, payload);
  },
  deleteFormSend(id) {
    return request.$http.delete(`${resource}/${id}`);
  },
};
