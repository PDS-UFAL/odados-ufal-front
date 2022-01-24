import request from './request';

const resource = '/api/responses';
export default {
  createAnswers(payload) {
    return request.$http.post(`${resource}`, payload);
  },
};
