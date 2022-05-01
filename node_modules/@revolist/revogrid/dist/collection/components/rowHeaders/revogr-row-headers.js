import { h, Host } from '@stencil/core';
import { Component, Prop, Event } from '@stencil/core';
import DataStore from '../../store/dataSource/data.store';
import ViewportStore from '../../store/viewPort/viewport.store';
import { UUID } from '../../utils/consts';
import { RowHeaderRender } from './row-header-render';
const LETTER_BLOCK_SIZE = 10;
export class RevogrRowHeaders {
  render() {
    var _a;
    const dataViews = [];
    const viewport = new ViewportStore();
    /** render viewports rows */
    let totalLength = 1;
    for (let data of this.dataPorts) {
      const itemCount = data.dataStore.get('items').length;
      // initiate row data
      const dataStore = new DataStore(data.type);
      dataStore.updateData(data.dataStore.get('source'));
      // initiate column data
      const colData = new DataStore('colPinStart');
      const column = Object.assign({ cellTemplate: RowHeaderRender(totalLength) }, this.rowHeaderColumn);
      colData.updateData([column]);
      const viewData = Object.assign(Object.assign({}, data), { dataStore: dataStore.store, colData: colData.store, viewportCol: viewport.store, readonly: true, range: false });
      dataViews.push(h("revogr-data", Object.assign({}, viewData)));
      totalLength += itemCount;
    }
    const colSize = ((_a = this.rowHeaderColumn) === null || _a === void 0 ? void 0 : _a.size) || (totalLength.toString().length + 1) * LETTER_BLOCK_SIZE;
    viewport.setViewport({
      realCount: 1,
      virtualSize: 0,
      items: [
        {
          size: colSize,
          start: 0,
          end: colSize,
          itemIndex: 0,
        },
      ],
    });
    const parent = `${this.uiid}-rowHeaders`;
    const viewportScroll = {
      [UUID]: parent,
      contentHeight: this.height,
      contentWidth: 0,
      style: { minWidth: `${colSize}px` },
      ref: (el) => this.elementToScroll.emit(el),
      onScrollViewport: (e) => this.scrollViewport.emit(e.detail),
    };
    const viewportHeader = Object.assign(Object.assign({}, this.headerProp), { colData: typeof this.rowHeaderColumn === 'object' ? [this.rowHeaderColumn] : [], viewportCol: viewport.store, canResize: false, parent, slot: 'header' });
    return h(Host, { class: "rowHeaders", key: "rowHeaders" },
      h("revogr-viewport-scroll", Object.assign({}, viewportScroll),
        h("revogr-header", Object.assign({}, viewportHeader)),
        dataViews));
  }
  static get is() { return "revogr-row-headers"; }
  static get properties() { return {
    "height": {
      "type": "number",
      "mutable": false,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "height",
      "reflect": false
    },
    "dataPorts": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "ViewportData[]",
        "resolved": "ViewportData[]",
        "references": {
          "ViewportData": {
            "location": "import",
            "path": "../revo-grid/viewport.interfaces"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      }
    },
    "headerProp": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Record<string, any>",
        "resolved": "{ [x: string]: any; }",
        "references": {
          "Record": {
            "location": "global"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      }
    },
    "uiid": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "uiid",
      "reflect": false
    },
    "resize": {
      "type": "boolean",
      "mutable": false,
      "complexType": {
        "original": "boolean",
        "resolved": "boolean",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "resize",
      "reflect": false
    },
    "rowHeaderColumn": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "RevoGrid.RowHeaders",
        "resolved": "RowHeaders",
        "references": {
          "RevoGrid": {
            "location": "import",
            "path": "../../interfaces"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      }
    }
  }; }
  static get events() { return [{
      "method": "scrollViewport",
      "name": "scrollViewport",
      "bubbles": false,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "RevoGrid.ViewPortScrollEvent",
        "resolved": "{ dimension: DimensionType; coordinate: number; delta?: number; }",
        "references": {
          "RevoGrid": {
            "location": "import",
            "path": "../../interfaces"
          }
        }
      }
    }, {
      "method": "elementToScroll",
      "name": "elementToScroll",
      "bubbles": false,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "ElementScroll",
        "resolved": "ElementScroll",
        "references": {
          "ElementScroll": {
            "location": "import",
            "path": "../revo-grid/viewport.scrolling.service"
          }
        }
      }
    }]; }
}
