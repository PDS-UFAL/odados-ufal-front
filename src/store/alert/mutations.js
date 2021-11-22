import TYPES from '../types';

export default {
  [TYPES.SET_ALERT_STATE](state, alertState) {
    console.log('setting state:', alertState);
    state.alertState = alertState;
  },
  [TYPES.SET_ALERT_MESSAGE](state, alertMessage) {
    console.log('setting message:', alertMessage);
    state.alertMessage = alertMessage;
  },
  [TYPES.SET_ALERT_COLOR](state, alertColor) {
    state.alertColor = alertColor;
  },
  [TYPES.SET_ALERT_TIMEOUT](state, alertTimeout) {
    state.alertTimeout = alertTimeout;
  },
};
