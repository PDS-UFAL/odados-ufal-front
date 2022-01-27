import formsApi from '@/api/forms';

export default {
  async fetchForms(store, options = {}) {
    return await formsApi.fetchForms(options);
  },
  async fetchForm(store, { id }) {
    return await formsApi.fetchForm(id);
  },
  async createForm(store, { payload }) {
    return await formsApi.createForm(payload);
  },
  async deleteForm(store, { id }) {
    return await formsApi.deleteForm(id);
  },
};
