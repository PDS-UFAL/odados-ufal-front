import request from './request';

const resource = '/api/responses';
export default {
  createAnswers(payload) {
    return request.$http.post(`${resource}`, payload);
  },
  fetchAnswersBySector(formId, sector) {
    return request.$http.get(`${resource}/forms/${formId}?sector_id=${sector}`);
  },
  createResponseHistory(payload) {
    return request.$http.post(`/api/forms/response_history`, payload);
  },
};
