import form_sendsApi from '@/api/form_sends';

export default {
  async fetchFormSends(store, options = {}) {
    return await form_sendsApi.fetchFormSends(options);
  },
  async fetchFormSend(store, { id }) {
    return await form_sendsApi.fetchFormSend(id);
  },
  async createFormSend(store, { payload }) {
    return await form_sendsApi.createFormSend(payload);
  },
  async deleteFormSend(store, { id }) {
    return await form_sendsApi.deleteFormSend(id);
  },
};
