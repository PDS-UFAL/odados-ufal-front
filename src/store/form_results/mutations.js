export default {
  ADD_RESULT(state, form_result) {
    let current_ids = state.form_results.map((result) => result.id);
    // If the formresult is already on the store, update it
    if (current_ids.includes(form_result.id)) {
      let id_index = state.form_results.findIndex(
        (result) => result.id === form_result.id,
      );
      state.form_results[id_index] = form_result;
      return;
    }

    state.form_results.push(form_result);
  },
  RESET(state) {
    state.form_results = [];
  },
};
