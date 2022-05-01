import reduce from 'lodash/reduce';
import { columnTypes, rowTypes } from '../store/storeTypes';
import DimensionStore from '../store/dimension/dimension.store';
import { getItemByIndex } from '../store/dimension/dimension.helpers';
export default class DimensionProvider {
  constructor(viewports) {
    this.viewports = viewports;
    this.stores = reduce([...rowTypes, ...columnTypes], (sources, k) => {
      sources[k] = new DimensionStore();
      return sources;
    }, {});
  }
  setDimensionSize(dimensionType, sizes) {
    this.stores[dimensionType].setDimensionSize(sizes);
    this.viewports.stores[dimensionType].setViewPortDimension(sizes);
  }
  setRealSize(realCount, type) {
    this.viewports.stores[type].setViewport({ realCount });
    this.stores[type].setRealSize(realCount);
  }
  /**
   * Sets dimension data and view port coordinate
   * @param items - data/column items
   * @param type - dimension type
   */
  setData(items, type, noVirtual = false) {
    this.setRealSize(items.length, type);
    if (noVirtual) {
      this.setNoVirtual(type);
    }
    this.setViewPortCoordinate({
      coordinate: this.viewports.stores[type].store.get('lastCoordinate'),
      type,
    });
  }
  setNoVirtual(type) {
    const dimension = this.stores[type].getCurrentState();
    this.viewports.stores[type].setViewport({ virtualSize: dimension.realSize });
  }
  drop() {
    for (let type of columnTypes) {
      this.stores[type].drop();
    }
  }
  setColumns(type, sizes, noVirtual = false) {
    this.stores[type].setDimensionSize(sizes);
    if (noVirtual) {
      this.setNoVirtual(type);
    }
    this.setViewPortCoordinate({
      coordinate: this.viewports.stores[type].store.get('lastCoordinate'),
      type,
    });
  }
  setViewPortCoordinate({ coordinate, type }) {
    const dimension = this.stores[type].getCurrentState();
    this.viewports.stores[type].setViewPortCoordinate(coordinate, dimension);
  }
  getViewPortPos(e) {
    const dimension = this.stores[e.dimension].getCurrentState();
    const item = getItemByIndex(dimension, e.coordinate);
    return item.start;
  }
  setSettings(data, dimensionType) {
    let stores = [];
    switch (dimensionType) {
      case 'rgCol':
        stores = columnTypes;
        break;
      case 'rgRow':
        stores = rowTypes;
        break;
    }
    for (let s of stores) {
      this.stores[s].setStore(data);
    }
  }
}
