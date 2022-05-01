'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-d3f67f2e.js');

const Clipboard = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.copyRegion = index.createEvent(this, "copyRegion", 3);
    this.pasteRegion = index.createEvent(this, "pasteRegion", 3);
  }
  onPaste(e) {
    const clipboardData = this.getData(e);
    const isHTML = clipboardData.types.indexOf('text/html') > -1;
    const data = isHTML ? clipboardData.getData('text/html') : clipboardData.getData('text');
    const parsedData = isHTML ? this.htmlParse(data) : this.textParse(data);
    this.pasteRegion.emit(parsedData);
    e.preventDefault();
  }
  copyStarted(e) {
    this.copyRegion.emit(this.getData(e));
    e.preventDefault();
  }
  async doCopy(e, data) {
    e.setData('text/plain', data ? this.parserCopy(data) : '');
  }
  parserCopy(data) {
    return data.map(rgRow => rgRow.join('\t')).join('\n');
  }
  textParse(data) {
    const result = [];
    const rows = data.split(/\r\n|\n|\r/);
    for (let y in rows) {
      result.push(rows[y].split('\t'));
    }
    return result;
  }
  htmlParse(data) {
    const result = [];
    const table = document.createRange().createContextualFragment(data).querySelector('table');
    for (const rgRow of Array.from(table.rows)) {
      result.push(Array.from(rgRow.cells).map(cell => cell.innerText));
    }
    return result;
  }
  getData(e) {
    var _a;
    return e.clipboardData || ((_a = window) === null || _a === void 0 ? void 0 : _a.clipboardData);
  }
};

exports.revogr_clipboard = Clipboard;
