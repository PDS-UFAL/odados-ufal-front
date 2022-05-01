import { getRange } from './selection.helpers';
export default class SelectionStoreService {
  constructor(store, config) {
    this.store = store;
    this.config = config;
    this.store = store;
  }
  get edited() {
    return this.store.get('edit');
  }
  get focused() {
    return this.store.get('focus');
  }
  get ranged() {
    return this.store.get('range');
  }
  changeRange(range) {
    return this.config.changeRange(range);
  }
  focus(cell, isMulti = false) {
    if (!cell) {
      return false;
    }
    let end = cell;
    // range edit
    if (isMulti) {
      let start = this.store.get('focus');
      if (start) {
        return this.config.changeRange(getRange(start, end));
      }
    }
    // single focus
    return this.config.focus(cell, end);
  }
}
