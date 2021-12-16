import TYPES from '../types';

export default {
  [TYPES.SET_QUESTIONS](state, questions) {
    state.question = [...questions];
  },
  [TYPES.ADD_QUESTION](state) {
    state.questions.push({
      ...state.defaultQuestion,
      id: state.questions.at(-1).id + 1,
    });
  },
  [TYPES.REMOVE_QUESTION](state, { id }) {
    if (state.questions.length === 1) return;

    state.questions = [
      ...state.questions.filter((question) => question.id !== id),
    ];
  },
  [TYPES.DUPLICATE_QUESTION](state, question) {
    state.questions.push({ ...question, id: state.questions.at(-1).id + 1 });
  },
};
