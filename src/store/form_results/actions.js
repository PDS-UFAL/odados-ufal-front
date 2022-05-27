export default {
  async createFormResult({ commit }, form_result) {
    commit('ADD_RESULT', form_result);
  },
  async resetFormResults({ commit }) {
    commit('RESET');
  },
  async deleteFormResult({ commit }, question_id) {
    commit('DELETE_QUESTION', question_id);
  },
};
