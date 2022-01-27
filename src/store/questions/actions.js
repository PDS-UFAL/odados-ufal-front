import TYPES from '../types';

export default {
  setQuestions({ commit }, questions) {
    commit(TYPES.SET_QUESTIONS, questions);
  },
  resetQuestions({ commit }) {
    commit(TYPES.RESET_QUESTIONS);
  },
  addQuestion({ commit }, question) {
    commit(TYPES.ADD_QUESTION, question);
  },
  removeQuestion({ commit }, question) {
    commit(TYPES.REMOVE_QUESTION, question);
  },
  duplicateQuestion({ commit }, question) {
    commit(TYPES.DUPLICATE_QUESTION, question);
  },
};
