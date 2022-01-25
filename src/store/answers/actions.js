import answersApi from '@/api/answers';

export default {
  async createAnswers(store, { payload }) {
    return await answersApi.createAnswers(payload);
  },
};
