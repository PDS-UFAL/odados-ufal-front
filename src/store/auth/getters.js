export default {
  authToken(state) {
    return state.token;
  },
  authenticated(state) {
    return !!state.token;
  },
  getUser(state) {
    return state.user;
  },
};
