import request from './request';

const resource = '/api/sectors';
export default {
  fetchSectors() {
    return request.$http.get(`${resource}`);
  },

  fetchSector(id) {
    return request.$http.get(`${resource}/${id}`);
  },
};
