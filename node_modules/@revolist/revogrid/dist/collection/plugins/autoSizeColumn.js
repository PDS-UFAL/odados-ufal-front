/**
 * Plugin module for revo-grid grid system
 * Add support for automatic column resize
 */
import each from 'lodash/each';
import reduce from 'lodash/reduce';
import BasePlugin from './basePlugin';
import ColumnDataProvider from '../services/column.data.provider';
import { columnTypes } from '../store/storeTypes';
import { getSourceItem } from '../store/dataSource/data.store';
const LETTER_BLOCK_SIZE = 7;
var ColumnAutoSizeMode;
(function (ColumnAutoSizeMode) {
  // increases column width on header click according the largest text value
  ColumnAutoSizeMode["headerClickAutosize"] = "headerClickAutoSize";
  // increases column width on data set and text edit, decreases performance
  ColumnAutoSizeMode["autoSizeOnTextOverlap"] = "autoSizeOnTextOverlap";
  // increases and decreases column width based on all items sizes, worst for performance
  ColumnAutoSizeMode["autoSizeAll"] = "autoSizeAll";
})(ColumnAutoSizeMode || (ColumnAutoSizeMode = {}));
export default class AutoSizeColumn extends BasePlugin {
  constructor(revogrid, providers, config) {
    super(revogrid);
    this.providers = providers;
    this.config = config;
    this.autoSizeColumns = null;
    /** for edge case when no columns defined before data */
    this.dataResolve = null;
    this.dataReject = null;
    this.letterBlockSize = (config === null || config === void 0 ? void 0 : config.letterBlockSize) || LETTER_BLOCK_SIZE;
    // create test container to check text width
    if (config === null || config === void 0 ? void 0 : config.preciseSize) {
      this.precsizeCalculationArea = this.initiatePresizeElement();
      revogrid.appendChild(this.precsizeCalculationArea);
    }
    const aftersourceset = ({ detail: { source } }) => {
      this.setSource(source);
    };
    const afteredit = ({ detail }) => {
      this.afteredit(detail);
    };
    const afterEditAll = ({ detail }) => {
      this.afterEditAll(detail);
    };
    const beforecolumnsset = ({ detail: { columns } }) => {
      this.columnSet(columns);
    };
    const headerDblClick = ({ detail }) => {
      const type = ColumnDataProvider.getColumnType(detail);
      const size = this.getColumnSize(detail.index, type);
      if (size) {
        this.providers.dimensionProvider.setDimensionSize(type, {
          [detail.index]: size,
        });
      }
    };
    this.addEventListener('beforecolumnsset', beforecolumnsset);
    switch (config === null || config === void 0 ? void 0 : config.mode) {
      case ColumnAutoSizeMode.autoSizeOnTextOverlap:
        this.addEventListener('aftersourceset', aftersourceset);
        this.addEventListener('afteredit', afteredit);
        break;
      case ColumnAutoSizeMode.autoSizeAll:
        this.addEventListener('aftersourceset', aftersourceset);
        this.addEventListener('afteredit', afterEditAll);
        break;
      default:
        this.addEventListener('headerdblClick', headerDblClick);
        break;
    }
  }
  async setSource(source) {
    let autoSize = this.autoSizeColumns;
    if (this.dataReject) {
      this.dataReject();
      this.clearPromise();
    }
    /** If data set first and no column provided await until get one */
    if (!autoSize) {
      const request = new Promise((resolve, reject) => {
        this.dataResolve = resolve;
        this.dataReject = reject;
      });
      try {
        autoSize = await request;
      }
      catch (e) {
        return;
      }
    }
    // calculate sizes
    each(autoSize, (_v, type) => {
      const sizes = {};
      each(autoSize[type], rgCol => {
        // calculate size
        rgCol.size = sizes[rgCol.index] = source.reduce((prev, rgRow) => Math.max(prev, this.getLength(rgRow[rgCol.prop])), 0);
      });
      this.providers.dimensionProvider.setDimensionSize(type, sizes);
    });
  }
  getLength(len) {
    var _a;
    const padding = 15;
    if (!len) {
      return 0;
    }
    try {
      const str = len.toString();
      /**if exact calculation required proxy with html element, slow operation */
      if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.preciseSize) {
        this.precsizeCalculationArea.innerText = str;
        return this.precsizeCalculationArea.scrollWidth + padding * 2;
      }
      return str.length * this.letterBlockSize + padding * 2;
    }
    catch (e) {
      return 0;
    }
  }
  afteredit(e) {
    let data;
    if (this.isRangeEdit(e)) {
      data = e.data;
    }
    else {
      data = { 0: { [e.prop]: e.val } };
    }
    each(this.autoSizeColumns, (columns, type) => {
      const sizes = {};
      each(columns, rgCol => {
        // calculate size
        const size = reduce(data, (prev, rgRow) => {
          if (typeof rgRow[rgCol.prop] === 'undefined') {
            return prev;
          }
          return Math.max(prev || 0, this.getLength(rgRow[rgCol.prop]));
        }, undefined);
        if (size && rgCol.size < size) {
          rgCol.size = sizes[rgCol.index] = size;
        }
      });
      this.providers.dimensionProvider.setDimensionSize(type, sizes);
    });
  }
  afterEditAll(e) {
    const props = {};
    if (this.isRangeEdit(e)) {
      each(e.data, r => each(r, (_v, p) => (props[p] = true)));
    }
    else {
      props[e.prop] = true;
    }
    each(this.autoSizeColumns, (columns, type) => {
      const sizes = {};
      each(columns, rgCol => {
        if (props[rgCol.prop]) {
          const size = this.getColumnSize(rgCol.index, type);
          if (size) {
            sizes[rgCol.index] = size;
          }
        }
      });
      this.providers.dimensionProvider.setDimensionSize(type, sizes);
    });
  }
  getColumnSize(index, type) {
    const rgCol = this.autoSizeColumns[type][index];
    if (!rgCol) {
      return 0;
    }
    return reduce(this.providers.dataProvider.stores, (r, s) => {
      const perStore = reduce(s.store.get('items'), (prev, _row, i) => {
        const item = getSourceItem(s.store, i);
        return Math.max(prev || 0, this.getLength(item[rgCol.prop]));
      }, 0);
      return Math.max(r, perStore);
    }, rgCol.size || 0);
  }
  columnSet(columns) {
    var _a;
    for (let t of columnTypes) {
      const type = t;
      const cols = columns[type];
      for (let i in cols) {
        if (cols[i].autoSize || ((_a = this.config) === null || _a === void 0 ? void 0 : _a.allColumns)) {
          if (!this.autoSizeColumns) {
            this.autoSizeColumns = {};
          }
          if (!this.autoSizeColumns[type]) {
            this.autoSizeColumns[type] = {};
          }
          this.autoSizeColumns[type][i] = Object.assign(Object.assign({}, cols[i]), { index: parseInt(i, 10) });
        }
      }
    }
    if (this.dataResolve) {
      this.dataResolve(this.autoSizeColumns);
      this.clearPromise();
    }
  }
  clearPromise() {
    this.dataResolve = null;
    this.dataReject = null;
  }
  isRangeEdit(e) {
    return !!e.data;
  }
  initiatePresizeElement() {
    const styleForFontTest = {
      position: 'absolute',
      fontSize: '14px',
      height: '0',
      width: '0',
      whiteSpace: 'nowrap',
      top: '0',
      overflowX: 'scroll',
    };
    const el = document.createElement('div');
    for (let s in styleForFontTest) {
      el.style[s] = styleForFontTest[s];
    }
    el.classList.add('revo-test-container');
    return el;
  }
  destroy() {
    var _a;
    super.destroy();
    (_a = this.precsizeCalculationArea) === null || _a === void 0 ? void 0 : _a.remove();
  }
}
