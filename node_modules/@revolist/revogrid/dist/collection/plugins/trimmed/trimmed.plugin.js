/**
 * Hide items from main collection
 * But keep them in store
 */
export const trimmedPlugin = (store) => ({
  set(k, newVal) {
    switch (k) {
      case 'trimmed':
        const proxy = store.get('proxyItems');
        const trimmed = gatherTrimmedItems(newVal);
        const newItems = proxy.reduce((result, v) => {
          // check if present in new trimmed remove from items (filter)
          if (!trimmed[v]) {
            result.push(v);
          }
          return result;
        }, []);
        store.set('items', newItems);
        break;
    }
  },
});
export function gatherTrimmedItems(trimmedItems) {
  const trimmed = {};
  for (let trimmedKey in trimmedItems) {
    // trimmed overweight not trimmed
    for (let t in trimmedItems[trimmedKey]) {
      trimmed[t] = trimmed[t] || trimmedItems[trimmedKey][t];
    }
  }
  return trimmed;
}
