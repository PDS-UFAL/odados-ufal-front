import { Component, Element, Event, h, Host, Method, Prop } from '@stencil/core';
import { getScrollbarWidth } from '../../utils/utils';
import LocalScrollService from '../../services/localScrollService';
export class RevogrScrollVirtual {
  constructor() {
    this.scrollSize = 0;
    this.isAutoHide = false;
    this.autoHideTimeout = 0;
    this.dimension = 'rgRow';
  }
  async setScroll(e) {
    var _a;
    if (this.dimension !== e.dimension) {
      return;
    }
    (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.setScroll(e);
  }
  // update on delta in case we don't know existing position or external change
  async changeScroll(e) {
    if (e.delta) {
      switch (e.dimension) {
        case 'rgCol':
          e.coordinate = this.element.scrollLeft + e.delta;
          break;
        case 'rgRow':
          e.coordinate = this.element.scrollTop + e.delta;
          break;
      }
      this.setScroll(e);
    }
    return e;
  }
  set size(s) {
    if (this.dimension === 'rgRow') {
      this.element.style.minWidth = `${s}px`;
      return;
    }
    this.element.style.minHeight = `${s}px`;
  }
  get size() {
    if (this.dimension === 'rgRow') {
      return this.element.clientHeight;
    }
    return this.element.clientWidth;
  }
  connectedCallback() {
    this.scrollService = new LocalScrollService({
      beforeScroll: e => this.scrollVirtual.emit(e),
      afterScroll: e => {
        const type = e.dimension === 'rgRow' ? 'scrollTop' : 'scrollLeft';
        this.element[type] = e.coordinate;
      },
    });
  }
  disconnectedCallback() {
    clearTimeout(this.autoHideTimeout);
  }
  componentWillLoad() {
    this.scrollSize = getScrollbarWidth(document);
    this.isAutoHide = !this.scrollSize;
  }
  componentDidRender() {
    const type = this.dimension === 'rgRow' ? 'scrollHeight' : 'scrollWidth';
    if (this.element[type] > this.size) {
      this.size = this.scrollSize;
    }
    else {
      this.size = 0;
    }
    this.scrollService.setParams({
      contentSize: this.dimensionStore.get('realSize'),
      clientSize: this.size,
      virtualSize: this.viewportStore.get('virtualSize'),
    }, this.dimension);
  }
  onScroll(e) {
    var _a;
    let type = 'scrollLeft';
    if (this.dimension === 'rgRow') {
      type = 'scrollTop';
    }
    if (this.isAutoHide) {
      this.size = 20;
      this.autoHideTimeout = this.autoHide(this.autoHideTimeout);
    }
    const target = e.target;
    (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(target[type] || 0, this.dimension);
  }
  autoHide(timeout) {
    clearTimeout(timeout);
    return setTimeout(() => {
      this.size = 0;
    }, 6000);
  }
  render() {
    const sizeType = this.dimension === 'rgRow' ? 'height' : 'width';
    return (h(Host, Object.assign({}, { 'auto-hide': this.isAutoHide }, { onScroll: (e) => this.onScroll(e) }),
      h("div", { style: { [sizeType]: `${this.extContentSize(this.viewportStore.get('virtualSize'), this.dimensionStore.get('realSize'))}px` } })));
  }
  extContentSize(vsize, contentSize) {
    return LocalScrollService.getVirtualContentSize(contentSize, this.size, vsize);
  }
  static get is() { return "revogr-scroll-virtual"; }
  static get originalStyleUrls() { return {
    "$": ["revogr-scroll-style.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["revogr-scroll-style.css"]
  }; }
  static get properties() { return {
    "dimension": {
      "type": "string",
      "mutable": false,
      "complexType": {
        "original": "RevoGrid.DimensionType",
        "resolved": "\"rgCol\" | \"rgRow\"",
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
      },
      "attribute": "dimension",
      "reflect": false,
      "defaultValue": "'rgRow'"
    },
    "viewportStore": {
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
    "dimensionStore": {
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
    }
  }; }
  static get events() { return [{
      "method": "scrollVirtual",
      "name": "scrollVirtual",
      "bubbles": true,
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
    }]; }
  static get methods() { return {
    "setScroll": {
      "complexType": {
        "signature": "(e: RevoGrid.ViewPortScrollEvent) => Promise<void>",
        "parameters": [{
            "tags": [],
            "text": ""
          }],
        "references": {
          "Promise": {
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
    },
    "changeScroll": {
      "complexType": {
        "signature": "(e: RevoGrid.ViewPortScrollEvent) => Promise<RevoGrid.ViewPortScrollEvent>",
        "parameters": [{
            "tags": [],
            "text": ""
          }],
        "references": {
          "Promise": {
            "location": "global"
          },
          "RevoGrid": {
            "location": "import",
            "path": "../../interfaces"
          }
        },
        "return": "Promise<ViewPortScrollEvent>"
      },
      "docs": {
        "text": "",
        "tags": []
      }
    }
  }; }
  static get elementRef() { return "element"; }
}
