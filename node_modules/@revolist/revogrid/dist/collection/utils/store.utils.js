/** Set stores data */
function setStore(store, data) {
  for (let key in data) {
    store.set(key, data[key]);
  }
}
export { setStore };
