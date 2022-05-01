import { each } from 'lodash';
import { getScrollbarWidth } from '../utils/utils';
import BasePlugin from './basePlugin';
export default class StretchColumn extends BasePlugin {
  constructor(revogrid, dimensionProvider) {
    super(revogrid);
    this.dimensionProvider = dimensionProvider;
    this.stretchedColumn = null;
    this.scrollSize = getScrollbarWidth(document);
    const beforecolumnapplied = ({ detail: { columns } }) => this.applyStretch(columns);
    this.addEventListener('beforecolumnapplied', beforecolumnapplied);
  }
  setScroll({ type, hasScroll }) {
    var _a;
    if (type === 'rgRow' && this.stretchedColumn && ((_a = this.stretchedColumn) === null || _a === void 0 ? void 0 : _a.initialSize) === this.stretchedColumn.size) {
      if (hasScroll) {
        this.stretchedColumn.size -= this.scrollSize;
        this.apply();
        this.dropChanges();
      }
    }
  }
  activateChanges() {
    const setScroll = ({ detail }) => this.setScroll(detail);
    this.addEventListener('scrollchange', setScroll);
  }
  dropChanges() {
    this.stretchedColumn = null;
    this.removeEventListener('scrollchange');
  }
  apply() {
    if (!this.stretchedColumn) {
      return;
    }
    const type = 'rgCol';
    this.dimensionProvider.setDimensionSize(type, { [this.stretchedColumn.index]: this.stretchedColumn.size });
  }
  applyStretch(columns) {
    this.dropChanges();
    let sizeDifference = this.revogrid.clientWidth - 1;
    each(columns, (_c, type) => {
      const realSize = this.dimensionProvider.stores[type].store.get('realSize');
      sizeDifference -= realSize;
    });
    if (sizeDifference > 0) {
      // currently plugin accepts last column
      const index = columns.rgCol.length - 1;
      const last = columns.rgCol[index];
      // has column
      // no auto size applied
      // size for column shouldn't be defined
      const colSize = (last === null || last === void 0 ? void 0 : last.size) || this.revogrid.colSize || 0;
      const size = sizeDifference + colSize - 1;
      if (last && !last.autoSize && (colSize < size)) {
        this.stretchedColumn = {
          initialSize: size,
          index,
          size
        };
        this.apply();
        this.activateChanges();
      }
    }
  }
}
export function isStretchPlugin(plugin) {
  return !!plugin.applyStretch;
}
