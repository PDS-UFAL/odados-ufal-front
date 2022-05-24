export default {
  ADD_RESULT(state, form_result) {
    state.form_results.push(form_result);
  },
  RESET(state) {
    state.form_result = {};
  },
};
