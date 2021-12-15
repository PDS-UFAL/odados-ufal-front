import request from './request';

const resource = '/forms';
export default {
  fetchForms() {
    return request.$http.get(`${resource}`);
  },
  fetchForm(id) {
    return request.$http.get(`${resource}/${id}`);
  },
  deleteForm(id) {
    return request.$http.delete(`${resource}/${id}`);
  },
};
