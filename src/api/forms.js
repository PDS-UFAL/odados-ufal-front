import request from './request';

const resource = '/api/forms';
export default {
  fetchForms(options) {
    return request.$http.get(`${resource}`, options);
  },
  fetchFormShowSends(id) {
    return request.$http.get(`${resource}/${id}/table`);
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
