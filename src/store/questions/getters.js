export default {
  getQuestions(state) {
    return state.questions;
  },
  getQuestion(state, index) {
    return state.question.find((question) => question.id === index);
  },
};
