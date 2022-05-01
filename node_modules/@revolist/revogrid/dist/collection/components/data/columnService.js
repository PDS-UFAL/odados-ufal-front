import { h } from '@stencil/core';
import { getSourceItem, getVisibleSourceItem, setSourceByVirtualIndex } from '../../store/dataSource/data.store';
import { CELL_CLASS, DISABLED_CLASS } from '../../utils/consts';
import { getRange } from '../../store/selection/selection.helpers';
import { isGroupingColumn } from '../../plugins/groupingRow/grouping.service';
export default class ColumnService {
  constructor(dataStore, source) {
    this.dataStore = dataStore;
    this.source = source;
    this.unsubscribe = [];
    this.hasGrouping = false;
    this.unsubscribe.push(source.onChange('source', s => this.checkGrouping(s)));
    this.checkGrouping(source.get('source'));
  }
  get columns() {
    return getVisibleSourceItem(this.source);
  }
  checkGrouping(cols) {
    for (let rgCol of cols) {
      if (isGroupingColumn(rgCol)) {
        this.hasGrouping = true;
        return;
      }
      this.hasGrouping = false;
    }
  }
  isReadOnly(r, c) {
    var _a;
    const readOnly = (_a = this.columns[c]) === null || _a === void 0 ? void 0 : _a.readonly;
    if (typeof readOnly === 'function') {
      const data = this.rowDataModel(r, c);
      return readOnly(data);
    }
    return readOnly;
  }
  static doMerge(existing, extra) {
    let props = Object.assign(Object.assign({}, extra), existing);
    // extend existing props
    if (extra.class) {
      if (typeof extra.class === 'object' && typeof props.class === 'object') {
        props.class = Object.assign(Object.assign({}, extra.class), props.class);
      }
      else if (typeof extra.class === 'string' && typeof props.class === 'object') {
        props.class[extra.class] = true;
      }
      else if (typeof props.class === 'string') {
        props.class += ' ' + extra.class;
      }
    }
    if (extra.style) {
      props.style = Object.assign(Object.assign({}, extra.style), props.style);
    }
    return props;
  }
  mergeProperties(r, c, defaultProps) {
    var _a;
    const cellClass = {
      [CELL_CLASS]: true,
      [DISABLED_CLASS]: this.isReadOnly(r, c),
    };
    let props = Object.assign(Object.assign({}, defaultProps), { class: cellClass });
    const extraPropsFunc = (_a = this.columns[c]) === null || _a === void 0 ? void 0 : _a.cellProperties;
    if (extraPropsFunc) {
      const data = this.rowDataModel(r, c);
      const extra = extraPropsFunc(data);
      if (!extra) {
        return props;
      }
      return ColumnService.doMerge(props, extra);
    }
    return props;
  }
  customRenderer(_r, c, model) {
    var _a;
    const tpl = (_a = this.columns[c]) === null || _a === void 0 ? void 0 : _a.cellTemplate;
    if (tpl) {
      return tpl(h, model);
    }
    return;
  }
  getRowClass(r, prop) {
    const model = getSourceItem(this.dataStore, r) || {};
    return model[prop] || '';
  }
  getCellData(r, c) {
    const data = this.rowDataModel(r, c);
    return ColumnService.getData(data.model[data.prop]);
  }
  getSaveData(rowIndex, c, val) {
    if (typeof val === 'undefined') {
      val = this.getCellData(rowIndex, c);
    }
    const data = this.rowDataModel(rowIndex, c);
    return {
      prop: data.prop,
      rowIndex,
      val,
      model: data.model,
      type: this.dataStore.get('type'),
    };
  }
  getCellEditor(_r, c, editors) {
    var _a;
    const editor = (_a = this.columns[c]) === null || _a === void 0 ? void 0 : _a.editor;
    if (!editor) {
      return undefined;
    }
    // reference
    if (typeof editor === 'string') {
      return editors[editor];
    }
    return editor;
  }
  rowDataModel(rowIndex, c) {
    const column = this.columns[c];
    const prop = column === null || column === void 0 ? void 0 : column.prop;
    const model = getSourceItem(this.dataStore, rowIndex) || {};
    return {
      prop,
      model,
      data: this.dataStore.get('source'),
      column,
      rowIndex,
    };
  }
  getRangeData(d) {
    const changed = {};
    // get original length sizes
    const copyColLength = d.oldProps.length;
    const copyFrom = this.copyRangeArray(d.oldRange, d.oldProps, this.dataStore);
    const copyRowLength = copyFrom.length;
    // rows
    for (let rowIndex = d.newRange.y, i = 0; rowIndex < d.newRange.y1 + 1; rowIndex++, i++) {
      // copy original data link
      const copyRow = copyFrom[i % copyRowLength];
      // columns
      for (let colIndex = d.newRange.x, j = 0; colIndex < d.newRange.x1 + 1; colIndex++, j++) {
        // check if old range area
        if (rowIndex >= d.oldRange.y && rowIndex <= d.oldRange.y1 && colIndex >= d.oldRange.x && colIndex <= d.oldRange.x1) {
          continue;
        }
        const p = this.columns[colIndex].prop;
        const currentCol = j % copyColLength;
        /** if can write */
        if (!this.isReadOnly(rowIndex, colIndex)) {
          /** to show before save */
          if (!changed[rowIndex]) {
            changed[rowIndex] = {};
          }
          changed[rowIndex][p] = copyRow[currentCol];
        }
      }
    }
    return changed;
  }
  getTransformedDataToApply(start, data) {
    const changed = {};
    const copyRowLength = data.length;
    const colLength = this.columns.length;
    const rowLength = this.dataStore.get('items').length;
    // rows
    let rowIndex = start.y;
    let maxCol = 0;
    for (let i = 0; rowIndex < rowLength && i < copyRowLength; rowIndex++, i++) {
      // copy original data link
      const copyRow = data[i % copyRowLength];
      const copyColLength = (copyRow === null || copyRow === void 0 ? void 0 : copyRow.length) || 0;
      // columns
      let colIndex = start.x;
      for (let j = 0; colIndex < colLength && j < copyColLength; colIndex++, j++) {
        const p = this.columns[colIndex].prop;
        const currentCol = j % colLength;
        /** if can write */
        if (!this.isReadOnly(rowIndex, colIndex)) {
          /** to show before save */
          if (!changed[rowIndex]) {
            changed[rowIndex] = {};
          }
          changed[rowIndex][p] = copyRow[currentCol];
        }
      }
      maxCol = Math.max(maxCol, colIndex - 1);
    }
    const range = getRange(start, {
      y: rowIndex - 1,
      x: maxCol,
    });
    return {
      changed,
      range,
    };
  }
  applyRangeData(data) {
    const items = {};
    for (let rowIndex in data) {
      const oldModel = (items[rowIndex] = getSourceItem(this.dataStore, parseInt(rowIndex, 10)));
      for (let prop in data[rowIndex]) {
        oldModel[prop] = data[rowIndex][prop];
      }
    }
    setSourceByVirtualIndex(this.dataStore, items);
  }
  getRangeStaticData(d, value) {
    const changed = {};
    // rows
    for (let rowIndex = d.y, i = 0; rowIndex < d.y1 + 1; rowIndex++, i++) {
      // columns
      for (let colIndex = d.x, j = 0; colIndex < d.x1 + 1; colIndex++, j++) {
        const p = this.columns[colIndex].prop;
        /** if can write */
        if (!this.isReadOnly(rowIndex, colIndex)) {
          /** to show before save */
          if (!changed[rowIndex]) {
            changed[rowIndex] = {};
          }
          changed[rowIndex][p] = value;
        }
      }
    }
    return changed;
  }
  copyRangeArray(range, rangeProps, store) {
    const toCopy = [];
    for (let i = range.y; i < range.y1 + 1; i++) {
      const rgRow = [];
      for (let prop of rangeProps) {
        const item = getSourceItem(store, i);
        rgRow.push(item[prop]);
      }
      toCopy.push(rgRow);
    }
    return toCopy;
  }
  static getData(val) {
    if (typeof val === 'undefined' || val === null) {
      return '';
    }
    return val.toString();
  }
  destroy() {
    this.unsubscribe.forEach(f => f());
  }
}
