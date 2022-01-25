import sectorsApi from '@/api/sectors';

export default {
  async fetchSectors() {
    return await sectorsApi.fetchSectors();
  },
  async fetchSector(store, { id }) {
    return await sectorsApi.fetchSector(id);
  },
};
