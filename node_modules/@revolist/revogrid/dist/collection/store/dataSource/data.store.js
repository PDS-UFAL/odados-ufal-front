import { createStore } from '@stencil/store';
import findIndex from 'lodash/findIndex';
import range from 'lodash/range';
import { trimmedPlugin } from '../../plugins/trimmed/trimmed.plugin';
import { setStore } from '../../utils/store.utils';
import { proxyPlugin } from './data.proxy';
export default class DataStore {
  constructor(type) {
    const store = (this.dataStore = createStore({
      items: [],
      proxyItems: [],
      source: [],
      groupingDepth: 0,
      groups: {},
      type,
      trimmed: {},
    }));
    store.use(proxyPlugin(store));
    store.use(trimmedPlugin(store));
  }
  get store() {
    return this.dataStore;
  }
  /**
   * full data source update
   * @param source - data column/rgRow source
   * @param grouping - grouping information if present
   */
  updateData(source, grouping, silent = false) {
    // during full update we do drop trim
    if (!silent) {
      this.store.set('trimmed', {});
    }
    // clear items
    this.store.set('items', []);
    const items = range(0, (source === null || source === void 0 ? void 0 : source.length) || 0);
    // set proxy first
    setStore(this.store, {
      source,
      proxyItems: [...items],
    });
    // update data items
    this.store.set('items', items);
    // apply grooping if present
    if (grouping) {
      setStore(this.store, {
        groupingDepth: grouping.depth,
        groups: grouping.groups,
      });
    }
  }
  addTrimmed(some) {
    let trimmed = this.store.get('trimmed');
    trimmed = Object.assign(Object.assign({}, trimmed), some);
    setStore(this.store, { trimmed });
  }
  // local data update
  setData(input) {
    const data = Object.assign({}, input);
    setStore(this.store, data);
  }
  refresh() {
    const source = this.store.get('source');
    this.store.set('source', [...source]);
  }
}
/**
 * get physical index by virtual
 * @param store - store to process
 */
export function getPhysical(store, virtualIndex) {
  const items = store.get('items');
  return items[virtualIndex];
}
/**
 * get all visible items
 * @param store - store to process
 */
export function getVisibleSourceItem(store) {
  const source = store.get('source');
  return store.get('items').map(v => source[v]);
}
/**
 * get mapped item from source
 * @param store - store to process
 * @param virtualIndex - virtual index to process
 */
export function getSourceItem(store, virtualIndex) {
  const items = store.get('items');
  const source = store.get('source');
  return source[items[virtualIndex]];
}
/**
 * set item to source
 * @param store  - store to process
 * @param modelByIndex - collection of rows with virtual indexes to setup
 */
export function setSourceByVirtualIndex(store, modelByIndex) {
  const items = store.get('items');
  const source = store.get('source');
  for (let virtualIndex in modelByIndex) {
    const realIndex = items[virtualIndex];
    source[realIndex] = modelByIndex[virtualIndex];
  }
  store.set('source', [...source]);
}
/**
 * set item to source
 * @param store  - store to process
 * @param modelByIndex - collection of rows with physical indexes to setup
 */
export function setSourceByPhysicalIndex(store, modelByIndex) {
  const source = store.get('source');
  for (let index in modelByIndex) {
    source[index] = modelByIndex[index];
  }
  store.set('source', [...source]);
}
export function setItems(store, items) {
  store.set('items', items);
}
export function getSourceItemVirtualIndexByProp(store, prop) {
  const items = store.get('items');
  const source = store.get('source');
  const physicalIndex = findIndex(source, { prop });
  return items.indexOf(physicalIndex);
}
