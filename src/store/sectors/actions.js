import sectorsApi from '@/api/sectors';

export default {
  async fetchSectors(store, options = {}) {
    return await sectorsApi.fetchSectors(options);
  },
  async fetchSector(store, { id }) {
    return await sectorsApi.fetchSector(id);
  },
};
