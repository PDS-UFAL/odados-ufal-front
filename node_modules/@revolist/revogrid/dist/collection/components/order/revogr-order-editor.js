import { Component, Method, Event, Prop, Listen } from '@stencil/core';
import debounce from 'lodash/debounce';
import { setItems } from '../../store/dataSource/data.store';
import { DRAGG_TEXT } from '../../utils/consts';
import RowOrderService from './rowOrderService';
export class OrderEditor {
  constructor() {
    this.rowMoveFunc = debounce((y) => {
      const rgRow = this.rowOrderService.move(y, this.getData());
      if (rgRow !== null) {
        this.internalRowDrag.emit(rgRow);
      }
    }, 5);
  }
  // --------------------------------------------------------------------------
  //
  //  Listeners
  //
  // --------------------------------------------------------------------------
  onMouseOut() {
    this.clearOrder();
  }
  /** Action finished inside of the document */
  onMouseUp(e) {
    this.endOrder(e);
  }
  // --------------------------------------------------------------------------
  //
  //  Methods
  //
  // --------------------------------------------------------------------------
  async dragStart(e) {
    e.preventDefault();
    // extra check if previous ended
    if (this.moveFunc) {
      this.clearOrder();
    }
    const data = this.getData();
    const cell = this.rowOrderService.startOrder(e, data);
    const pos = this.rowOrderService.getRow(e.y, data);
    const dragStartEvent = this.internalRowDragStart.emit({ cell, text: DRAGG_TEXT, pos, event: e });
    if (dragStartEvent.defaultPrevented) {
      return;
    }
    this.moveFunc = (e) => this.move(e);
    document.addEventListener('mousemove', this.moveFunc);
  }
  async endOrder(e) {
    this.rowOrderService.endOrder(e, this.getData());
    this.clearOrder();
  }
  async clearOrder() {
    this.rowOrderService.clear();
    document.removeEventListener('mousemove', this.moveFunc);
    this.moveFunc = null;
    this.internalRowDragEnd.emit();
  }
  // --------------------------------------------------------------------------
  //
  //  Component methods
  //
  // --------------------------------------------------------------------------
  move({ x, y }) {
    this.internalRowMouseMove.emit({ x, y });
    this.rowMoveFunc(y);
  }
  connectedCallback() {
    this.rowOrderService = new RowOrderService({ positionChanged: (f, t) => this.onPositionChanged(f, t) });
  }
  onPositionChanged(from, to) {
    const dropEvent = this.initialRowDropped.emit({ from, to });
    if (dropEvent.defaultPrevented) {
      return;
    }
    const items = [...this.dataStore.get('items')];
    const toMove = items.splice(from, 1);
    items.splice(to, 0, ...toMove);
    setItems(this.dataStore, items);
  }
  getData() {
    return {
      el: this.parent,
      rows: this.dimensionRow.state,
      cols: this.dimensionCol.state,
    };
  }
  static get is() { return "revogr-order-editor"; }
  static get properties() { return {
    "parent": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "HTMLElement",
        "resolved": "HTMLElement",
        "references": {
          "HTMLElement": {
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
    "dimensionRow": {
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
    "dataStore": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>",
        "resolved": "ObservableMap<DataSourceState<DataType, DimensionRows>>",
        "references": {
          "Observable": {
            "location": "import",
            "path": "../../interfaces"
          },
          "DataSourceState": {
            "location": "import",
            "path": "../../store/dataSource/data.store"
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
        "text": "Static stores, not expected to change during component lifetime"
      }
    }
  }; }
  static get events() { return [{
      "method": "internalRowDragStart",
      "name": "internalRowDragStart",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Row drag started"
      },
      "complexType": {
        "original": "{\n    cell: Selection.Cell;\n    text: string;\n    pos: RevoGrid.PositionItem;\n    event: MouseEvent;\n  }",
        "resolved": "{ cell: Cell; text: string; pos: PositionItem; event: MouseEvent; }",
        "references": {
          "Selection": {
            "location": "import",
            "path": "../../interfaces"
          },
          "RevoGrid": {
            "location": "import",
            "path": "../../interfaces"
          },
          "MouseEvent": {
            "location": "global"
          }
        }
      }
    }, {
      "method": "internalRowDragEnd",
      "name": "internalRowDragEnd",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Row drag ended"
      },
      "complexType": {
        "original": "any",
        "resolved": "any",
        "references": {}
      }
    }, {
      "method": "internalRowDrag",
      "name": "internalRowDrag",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Row move"
      },
      "complexType": {
        "original": "RevoGrid.PositionItem",
        "resolved": "PositionItem",
        "references": {
          "RevoGrid": {
            "location": "import",
            "path": "../../interfaces"
          }
        }
      }
    }, {
      "method": "internalRowMouseMove",
      "name": "internalRowMouseMove",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Row mouse move"
      },
      "complexType": {
        "original": "Selection.Cell",
        "resolved": "Cell",
        "references": {
          "Selection": {
            "location": "import",
            "path": "../../interfaces"
          }
        }
      }
    }, {
      "method": "initialRowDropped",
      "name": "initialRowDropped",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Row dragged, new range ready to be applied"
      },
      "complexType": {
        "original": "{ from: number; to: number }",
        "resolved": "{ from: number; to: number; }",
        "references": {}
      }
    }]; }
  static get methods() { return {
    "dragStart": {
      "complexType": {
        "signature": "(e: MouseEvent) => Promise<void>",
        "parameters": [{
            "tags": [],
            "text": ""
          }],
        "references": {
          "Promise": {
            "location": "global"
          },
          "MouseEvent": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "",
        "tags": []
      }
    },
    "endOrder": {
      "complexType": {
        "signature": "(e: MouseEvent) => Promise<void>",
        "parameters": [{
            "tags": [],
            "text": ""
          }],
        "references": {
          "Promise": {
            "location": "global"
          },
          "MouseEvent": {
            "location": "global"
          }
        },
        "return": "Promise<void>"
      },
      "docs": {
        "text": "",
        "tags": []
      }
    },
    "clearOrder": {
      "complexType": {
        "signature": "() => Promise<void>",
        "parameters": [],
        "references": {
          "Promise": {
            "location": "global"
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
      "name": "mouseleave",
      "method": "onMouseOut",
      "target": "document",
      "capture": false,
      "passive": true
    }, {
      "name": "mouseup",
      "method": "onMouseUp",
      "target": "document",
      "capture": false,
      "passive": true
    }]; }
}
