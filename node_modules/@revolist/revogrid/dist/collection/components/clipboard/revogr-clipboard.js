import { Component, Listen, Method, Event } from '@stencil/core';
export class Clipboard {
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
  static get is() { return "revogr-clipboard"; }
  static get events() { return [{
      "method": "copyRegion",
      "name": "copyRegion",
      "bubbles": false,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "DataTransfer",
        "resolved": "DataTransfer",
        "references": {
          "DataTransfer": {
            "location": "global"
          }
        }
      }
    }, {
      "method": "pasteRegion",
      "name": "pasteRegion",
      "bubbles": false,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "string[][]",
        "resolved": "string[][]",
        "references": {}
      }
    }]; }
  static get methods() { return {
    "doCopy": {
      "complexType": {
        "signature": "(e: DataTransfer, data?: RevoGrid.DataFormat[][]) => Promise<void>",
        "parameters": [{
            "tags": [],
            "text": ""
          }, {
            "tags": [],
            "text": ""
          }],
        "references": {
          "Promise": {
            "location": "global"
          },
          "DataTransfer": {
            "location": "global"
          },
          "RevoGrid": {
            "location": "import",
            "path": "../../interfaces"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "",
        "tags": []
      }
    }
  }; }
  static get listeners() { return [{
      "name": "paste",
      "method": "onPaste",
      "target": "document",
      "capture": false,
      "passive": false
    }, {
      "name": "copy",
      "method": "copyStarted",
      "target": "document",
      "capture": false,
      "passive": false
    }]; }
}
