import formsApi from '@/api/forms';

export default {
  async fetchForms() {
    return await formsApi.fetchForms();
  },
  async fetchForm(store, { id }) {
    return await formsApi.fetchForm(id);
  },
  async deleteForm(store, { id }) {
    return await formsApi.deleteForm(id);
  },
};
