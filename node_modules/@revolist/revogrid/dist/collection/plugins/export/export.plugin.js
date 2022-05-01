import fill from 'lodash/fill';
import { columnTypes, rowTypes } from '../../store/storeTypes';
import { timeout } from '../../utils/utils';
import BasePlugin from '../basePlugin';
import ExportCsv from './csv';
var ExportTypes;
(function (ExportTypes) {
  ExportTypes["csv"] = "csv";
})(ExportTypes || (ExportTypes = {}));
export default class ExportFilePlugin extends BasePlugin {
  /** Exports string */
  async exportString(options = {}, t = ExportTypes.csv) {
    const data = await this.beforeexport();
    if (!data) {
      return null;
    }
    return this.formatter(t, options).doExport(data);
  }
  /** Exports Blob */
  async exportBlob(options = {}, t = ExportTypes.csv) {
    return await this.getBlob(this.formatter(t, options));
  }
  /** Export file */
  async exportFile(options = {}, t = ExportTypes.csv) {
    const formatter = this.formatter(t, options);
    const blob = await this.getBlob(formatter);
    // url
    const URL = window.URL || window.webkitURL;
    const a = document.createElement('a');
    const { filename, fileKind } = formatter.options;
    const name = `${filename}.${fileKind}`;
    const url = URL.createObjectURL(blob);
    a.style.display = 'none';
    a.setAttribute('href', url);
    a.setAttribute('download', name);
    this.revogrid.appendChild(a);
    a.dispatchEvent(new MouseEvent('click'));
    this.revogrid.removeChild(a);
    // delay for revoke, correct for some browsers
    await timeout(120);
    URL.revokeObjectURL(url);
  }
  /** Blob object */
  async getBlob(formatter) {
    const type = `${formatter.options.mime};charset=${formatter.options.encoding}`;
    if (typeof Blob !== 'undefined') {
      const data = await this.beforeexport();
      if (!data) {
        return null;
      }
      return new Blob([formatter.doExport(data)], { type });
    }
    return null;
  }
  // before event
  async beforeexport() {
    let data = await this.getData();
    const event = this.emit('beforeexport', { data });
    if (event.defaultPrevented) {
      return null;
    }
    return event.detail.data;
  }
  async getData() {
    const data = await this.getSource();
    const colSource = [];
    const colPromises = [];
    columnTypes.forEach((t, i) => {
      colPromises.push(this.getColPerSource(t).then(s => (colSource[i] = s)));
    });
    await Promise.all(colPromises);
    const columns = {
      headers: [],
      props: [],
    };
    for (let source of colSource) {
      source.headers.forEach((h, i) => {
        if (!columns.headers[i]) {
          columns.headers[i] = [];
        }
        columns.headers[i].push(...h);
      });
      columns.props.push(...source.props);
    }
    return Object.assign({ data }, columns);
  }
  async getColPerSource(t) {
    const store = await this.revogrid.getColumnStore(t);
    const source = store.get('source');
    const virtualIndexes = store.get('items');
    const depth = store.get('groupingDepth');
    const groups = store.get('groups');
    const colNames = [];
    const colProps = [];
    const visibleItems = virtualIndexes.reduce((r, v, virtualIndex) => {
      const prop = source[v].prop;
      colNames.push(source[v].name || '');
      colProps.push(prop);
      r[prop] = virtualIndex;
      return r;
    }, {});
    const rows = this.getGroupHeaders(depth, groups, virtualIndexes, visibleItems);
    rows.push(colNames);
    return {
      headers: rows,
      props: colProps,
    };
  }
  getGroupHeaders(depth, groups, items, visibleItems) {
    const rows = [];
    const template = fill(new Array(items.length), '');
    for (let d = 0; d < depth; d++) {
      const rgRow = [...template];
      rows.push(rgRow);
      if (!groups[d]) {
        continue;
      }
      const levelGroups = groups[d];
      // add names of groups
      levelGroups.forEach((group) => {
        const minIndex = this.findGroupStartIndex(group.ids, visibleItems);
        if (typeof minIndex === 'number') {
          rgRow[minIndex] = group.name;
        }
      });
    }
    return rows;
  }
  findGroupStartIndex(ids, visibleItems) {
    let min;
    ids.forEach(id => {
      const current = visibleItems[id];
      if (typeof current === 'number') {
        if (typeof min !== 'number' || min > current) {
          min = current;
        }
      }
    });
    return min;
  }
  async getSource() {
    const data = [];
    const promisesData = [];
    rowTypes.forEach(t => {
      const dataPart = [];
      data.push(dataPart);
      const promise = this.revogrid.getVisibleSource(t).then((d) => dataPart.push(...d));
      promisesData.push(promise);
    });
    await Promise.all(promisesData);
    return data.reduce((r, v) => {
      r.push(...v);
      return r;
    }, []);
  }
  // get correct class for future multiple types support
  formatter(type, options = {}) {
    switch (type) {
      case ExportTypes.csv:
        return new ExportCsv(options);
      default:
        throw new Error('Unknown format');
    }
  }
}
