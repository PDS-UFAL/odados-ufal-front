import reduce from 'lodash/reduce';
import DataStore, { getSourceItem, getVisibleSourceItem, setSourceByVirtualIndex } from '../store/dataSource/data.store';
import { isRowType, rowTypes } from '../store/storeTypes';
export class DataProvider {
  constructor(dimensionProvider) {
    this.dimensionProvider = dimensionProvider;
    this.stores = reduce(rowTypes, (sources, k) => {
      sources[k] = new DataStore(k);
      return sources;
    }, {});
  }
  setData(data, type = 'rgRow', grouping, silent = false) {
    // set rgRow data
    this.stores[type].updateData([...data], grouping, silent);
    this.dimensionProvider.setData(data, type, type !== 'rgRow');
    return data;
  }
  getModel(virtualIndex, type = 'rgRow') {
    const store = this.stores[type].store;
    return getSourceItem(store, virtualIndex);
  }
  setCellData({ type, rowIndex, prop, val }) {
    const model = this.getModel(rowIndex, type);
    model[prop] = val;
    setSourceByVirtualIndex(this.stores[type].store, { [rowIndex]: model });
  }
  refresh(type = 'all') {
    if (isRowType(type)) {
      this.refreshItems(type);
    }
    rowTypes.forEach((t) => this.refreshItems(t));
  }
  refreshItems(type = 'rgRow') {
    const items = this.stores[type].store.get('items');
    this.stores[type].setData({ items: [...items] });
  }
  setGrouping({ depth }, type = 'rgRow') {
    this.stores[type].setData({ groupingDepth: depth });
  }
  setTrimmed(trimmed, type = 'rgRow') {
    const store = this.stores[type];
    store.addTrimmed(trimmed);
    if (type === 'rgRow') {
      this.dimensionProvider.setData(getVisibleSourceItem(store.store), type);
    }
  }
}
