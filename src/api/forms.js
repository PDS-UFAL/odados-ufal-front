import request from './request';

const resource = '/api/forms';
export default {
  fetchForms(options) {
    return request.$http.get(`${resource}`, options);
  },
  fetchFormShowSends(id, options) {
    return request.$http.get(`${resource}/${id}/table`, {
      params: options,
    });
  },
  fetchForm(id) {
    return request.$http.get(`${resource}/${id}`);
  },
  fetchFormWithFormSends(id) {
    return request.$http.get(`${resource}/${id}/form_sends`);
  },
  createForm(payload) {
    return request.$http.post(`${resource}`, payload);
  },
  deleteForm(id) {
    return request.$http.delete(`${resource}/${id}`);
  },
};
