import answersApi from '@/api/answers';

export default {
  async createAnswers(store, { payload }) {
    return await answersApi.createAnswers(payload);
  },
  async fetchAnswersBySector(store, { formId, sector }) {
    return await answersApi.fetchAnswersBySector(formId, sector);
  },
};
