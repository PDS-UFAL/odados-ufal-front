import request from './request';

const resource = '/api/sectors';
export default {
  fetchSectors(options) {
    return request.$http.get(`${resource}`, options);
  },

  fetchSector(id) {
    return request.$http.get(`${resource}/${id}`);
  },
};
