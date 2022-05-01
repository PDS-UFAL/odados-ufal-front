import { Component, Element, Event, h, Prop } from '@stencil/core';
import keyBy from 'lodash/keyBy';
import { HEADER_ACTUAL_ROW_CLASS, HEADER_ROW_CLASS } from '../../utils/consts';
import HeaderRenderer from './headerRenderer';
import ColumnGroupsRenderer from '../../plugins/groupingColumn/columnGroupsRenderer';
export class RevogrHeaderComponent {
  constructor() {
    this.parent = '';
    this.groupingDepth = 0;
  }
  onResize({ width }, index) {
    this.headerresize.emit({ [index]: width || 0 });
  }
  onResizeGroup(changedX, startIndex, endIndex) {
    const sizes = {};
    const cols = keyBy(this.viewportCol.get('items'), 'itemIndex');
    const change = changedX / (endIndex - startIndex + 1);
    for (let i = startIndex; i <= endIndex; i++) {
      const item = cols[i];
      if (item) {
        sizes[i] = item.size + change;
      }
    }
    this.headerresize.emit(sizes);
  }
  render() {
    var _a;
    const cols = this.viewportCol.get('items');
    const range = (_a = this.selectionStore) === null || _a === void 0 ? void 0 : _a.get('range');
    const cells = [];
    const visibleProps = {};
    // render header columns
    for (let rgCol of cols) {
      const colData = this.colData[rgCol.itemIndex];
      cells.push(h(HeaderRenderer, { range: range, column: rgCol, data: colData, canFilter: !!this.columnFilter, canResize: this.canResize, onResize: e => this.onResize(e, rgCol.itemIndex), onDoubleClick: e => this.headerdblClick.emit(e), onClick: e => this.initialHeaderClick.emit(e) }));
      visibleProps[colData === null || colData === void 0 ? void 0 : colData.prop] = rgCol.itemIndex;
    }
    return [
      h("div", { class: "group-rgRow" },
        h(ColumnGroupsRenderer, { canResize: this.canResize, visibleProps: visibleProps, groups: this.groups, dimensionCol: this.dimensionCol.state, depth: this.groupingDepth, onResize: (changedX, startIndex, endIndex) => this.onResizeGroup(changedX, startIndex, endIndex) })),
      h("div", { class: `${HEADER_ROW_CLASS} ${HEADER_ACTUAL_ROW_CLASS}` }, cells),
    ];
  }
  static get is() { return "revogr-header"; }
  static get originalStyleUrls() { return {
    "$": ["revogr-header-style.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["revogr-header-style.css"]
  }; }
  static get properties() { return {
    "viewportCol": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Observable<RevoGrid.ViewportState>",
        "resolved": "ObservableMap<ViewportState>",
        "references": {
          "Observable": {
            "location": "import",
            "path": "../../interfaces"
          },
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
    },
    "dimensionCol": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Observable<RevoGrid.DimensionSettingsState>",
        "resolved": "ObservableMap<DimensionSettingsState>",
        "references": {
          "Observable": {
            "location": "import",
            "path": "../../interfaces"
          },
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
    },
    "selectionStore": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Observable<Selection.SelectionStoreState>",
        "resolved": "ObservableMap<SelectionStoreState>",
        "references": {
          "Observable": {
            "location": "import",
            "path": "../../interfaces"
          },
          "Selection": {
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
    },
    "parent": {
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
      "attribute": "parent",
      "reflect": false,
      "defaultValue": "''"
    },
    "groups": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Groups",
        "resolved": "{ [x: string]: any; }",
        "references": {
          "Groups": {
            "location": "import",
            "path": "../../store/dataSource/data.store"
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
    "groupingDepth": {
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
      "attribute": "grouping-depth",
      "reflect": false,
      "defaultValue": "0"
    },
    "canResize": {
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
      "attribute": "can-resize",
      "reflect": false
    },
    "colData": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "RevoGrid.ColumnRegular[]",
        "resolved": "ColumnRegular[]",
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
    },
    "columnFilter": {
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
      "attribute": "column-filter",
      "reflect": false
    }
  }; }
  static get events() { return [{
      "method": "initialHeaderClick",
      "name": "initialHeaderClick",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "RevoGrid.InitialHeaderClick",
        "resolved": "{ index: number; originalEvent: MouseEvent; column: ColumnRegular; }",
        "references": {
          "RevoGrid": {
            "location": "import",
            "path": "../../interfaces"
          }
        }
      }
    }, {
      "method": "headerresize",
      "name": "headerresize",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "RevoGrid.ViewSettingSizeProp",
        "resolved": "{ [x: string]: number; }",
        "references": {
          "RevoGrid": {
            "location": "import",
            "path": "../../interfaces"
          }
        }
      }
    }, {
      "method": "headerdblClick",
      "name": "headerdblClick",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "RevoGrid.InitialHeaderClick",
        "resolved": "{ index: number; originalEvent: MouseEvent; column: ColumnRegular; }",
        "references": {
          "RevoGrid": {
            "location": "import",
            "path": "../../interfaces"
          }
        }
      }
    }]; }
  static get elementRef() { return "element"; }
}
