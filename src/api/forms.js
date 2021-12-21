import request from './request';

const resource = '/api/forms';
export default {
  fetchForms() {
    return request.$http.get(`${resource}`);
  },
  fetchForm(id) {
    return request.$http.get(`${resource}/${id}`);
  },
  createForm(payload) {
    return request.$http.post(`${resource}`, payload);
  },
  deleteForm(id) {
    return request.$http.delete(`${resource}/${id}`);
  },
};
