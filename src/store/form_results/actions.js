//import VueApexCharts from 'vue-apexcharts';

export default {
  async createFormResult({ commit }, form_result) {
    commit('ADD_RESULT', form_result);
  },
  async resetFormResult({ commit }) {
    commit('RESET');
  },
  /* async exportPageResults(state) {
    state.form_results.forEach((form_result) => {
      if (form_result.type === 'chart') {
        );
      }
    });
  },*/
};
