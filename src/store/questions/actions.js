import TYPES from '../types';

export default {
  setQuestions({ commit }, questions) {
    commit(TYPES.SET_QUESTIONS, questions);
  },
  resetQuestions({ commit }) {
    commit(TYPES.RESET_QUESTIONS);
  },
  addQuestion({ commit }, section) {
    commit(TYPES.ADD_QUESTION, section);
  },
  removeQuestion({ commit }, question) {
    commit(TYPES.REMOVE_QUESTION, question);
  },
  duplicateQuestion({ commit }, question) {
    commit(TYPES.DUPLICATE_QUESTION, question);
  },
  addSection({ commit }) {
    commit(TYPES.ADD_SECTION);
  },
};
