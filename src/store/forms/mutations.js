import TYPES from '../types';

export default {
  [TYPES.SET_TITLE](state, title) {
    state.title = title;
  },
  [TYPES.SET_DESCRIPTION](state, description) {
    state.description = description;
  },
  [TYPES.SET_SELECTEDSECTORS](state, selectedSectors) {
    state.selectedSectors = [...selectedSectors];
  },
};
