export default {
  getQuestions(state) {
    return state.questions;
  },
  getQuestion(state, index) {
    return state.question.find((question) => question.id === index);
  },
  getSections(state) {
    return state.sections;
  },
  getSection(state, index) {
    return state.sections.find((section) => section.id === index);
  },
};
