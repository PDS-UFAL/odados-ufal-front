import { createStore } from '@stencil/store';
import { setStore } from '../../utils/store.utils';
import { getRange } from './selection.helpers';
function defaultState() {
  return {
    range: null,
    tempRange: null,
    tempRangeType: null,
    focus: null,
    edit: null,
    lastCell: null,
  };
}
export class SelectionStore {
  constructor() {
    this.unsubscribe = [];
    this.store = createStore(defaultState());
    this.store.on('set', (key, newVal) => {
      if (key === 'tempRange' && !newVal) {
        this.store.set('tempRangeType', null);
      }
    });
  }
  onChange(propName, cb) {
    this.unsubscribe.push(this.store.onChange(propName, cb));
  }
  clearFocus() {
    setStore(this.store, { focus: null, range: null, edit: null, tempRange: null });
  }
  setFocus(focus, end) {
    setStore(this.store, {
      focus,
      range: getRange(focus, end),
      edit: null,
      tempRange: null,
    });
  }
  setTempArea(range) {
    setStore(this.store, { tempRange: range === null || range === void 0 ? void 0 : range.area, tempRangeType: range === null || range === void 0 ? void 0 : range.type, edit: null });
  }
  clearTemp() {
    setStore(this.store, { tempRange: null });
  }
  /** Can be applied from selection change or from simple keyboard change clicks */
  setRangeArea(range) {
    setStore(this.store, { range, edit: null, tempRange: null });
  }
  setRange(start, end) {
    this.setRangeArea(getRange(start, end));
  }
  setLastCell(lastCell) {
    setStore(this.store, { lastCell });
  }
  setEdit(val) {
    const focus = this.store.get('focus');
    if (focus && typeof val === 'string') {
      setStore(this.store, {
        edit: { x: focus.x, y: focus.y, val },
      });
      return;
    }
    setStore(this.store, { edit: null });
  }
  dispose() {
    this.unsubscribe.forEach(f => f());
    this.store.dispose();
  }
}
