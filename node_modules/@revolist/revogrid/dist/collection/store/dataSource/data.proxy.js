/**
 * All items
 * Used as proxy for sorting
 * Keep order but do not modify final source
 */
export const proxyPlugin = (store) => ({
  set(k, newVal) {
    if (!isProxy(k)) {
      return;
    }
    /**
     * Getting existing collection of items
     * Mark indexes as visible
     */
    const oldItems = store.get('items').reduce((r, v) => {
      r[v] = true;
      return r;
    }, {});
    /**
     * Check if new values where present in items
     * Filter item collection according presense
     */
    const newItems = newVal.reduce((r, i) => {
      if (oldItems[i]) {
        r.push(i);
      }
      return r;
    }, []);
    store.set('items', newItems);
  },
});
function isProxy(k) {
  return k === 'proxyItems';
}
