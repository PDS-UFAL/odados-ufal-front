import TYPES from '../types';

export default {
  setAlert(
    { commit },
    { alertState = true, alertMessage, alertColor, alertTimeout = 5000 },
  ) {
    commit(TYPES.SET_ALERT_STATE, alertState);
    commit(TYPES.SET_ALERT_MESSAGE, alertMessage);
    commit(TYPES.SET_ALERT_COLOR, alertColor);
    commit(TYPES.SET_ALERT_TIMEOUT, alertTimeout);
  },
  setAlertState({ commit }, alertState = false) {
    commit(TYPES.SET_ALERT_STATE, alertState);
  },
};
