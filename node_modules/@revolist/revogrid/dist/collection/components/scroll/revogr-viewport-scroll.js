import { Component, Event, h, Method, Element, Prop, Host } from '@stencil/core';
import each from 'lodash/each';
import GridResizeService from '../revo-grid/viewport.resize.service';
import LocalScrollService from '../../services/localScrollService';
import { CONTENT_SLOT, FOOTER_SLOT, HEADER_SLOT } from '../revo-grid/viewport.helpers';
/**
 * Service for tracking grid scrolling
 */
export class RevogrViewportScroll {
  constructor() {
    this.scrollThrottling = 30;
    /**
     * Width of inner content
     */
    this.contentWidth = 0;
    /**
     * Height of inner content
     */
    this.contentHeight = 0;
    this.oldValY = this.contentHeight;
    this.oldValX = this.contentWidth;
    /**
     * Last mw event time for trigger scroll function below
     * If mousewheel function was ignored we still need to trigger render
     */
    this.mouseWheelScroll = { rgCol: 0, rgRow: 0 };
  }
  async setScroll(e) {
    var _a;
    this.latestScrollUpdate(e.dimension);
    (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.setScroll(e);
  }
  /**
   * update on delta in case we don't know existing position or external change
   * @param e
   */
  async changeScroll(e) {
    if (e.delta) {
      switch (e.dimension) {
        case 'rgCol':
          e.coordinate = this.horizontalScroll.scrollLeft + e.delta;
          break;
        case 'rgRow':
          e.coordinate = this.verticalScroll.scrollTop + e.delta;
          break;
      }
      this.setScroll(e);
    }
    return e;
  }
  connectedCallback() {
    /**
     * Bind scroll functions for farther usage
     */
    if ('ontouchstart' in document.documentElement) {
      this.scrollThrottling = 0;
    }
    else {
      this.verticalMouseWheel = this.onVerticalMouseWheel.bind(this, 'rgRow', 'deltaY');
      this.horizontalMouseWheel = this.onHorizontalMouseWheel.bind(this, 'rgCol', 'deltaX');
    }
    /**
     * Create local scroll service
     */
    this.scrollService = new LocalScrollService({
      beforeScroll: e => this.scrollViewport.emit(e),
      afterScroll: e => {
        switch (e.dimension) {
          case 'rgCol':
            this.horizontalScroll.scrollLeft = e.coordinate;
            break;
          case 'rgRow':
            this.verticalScroll.scrollTop = e.coordinate;
            break;
        }
      },
    });
  }
  componentDidLoad() {
    /**
     * Track horizontal viewport resize
     */
    this.horisontalResize = new GridResizeService(this.horizontalScroll, {
      resize: entries => {
        var _a, _b;
        let height = ((_a = entries[0]) === null || _a === void 0 ? void 0 : _a.contentRect.height) || 0;
        if (height) {
          height -= this.header.clientHeight + this.footer.clientHeight;
        }
        const els = {
          rgRow: {
            size: height,
            contentSize: this.contentHeight,
            scroll: this.verticalScroll.scrollTop,
          },
          rgCol: {
            size: ((_b = entries[0]) === null || _b === void 0 ? void 0 : _b.contentRect.width) || 0,
            contentSize: this.contentWidth,
            scroll: this.horizontalScroll.scrollLeft,
          },
        };
        each(els, (item, dimension) => {
          var _a;
          this.resizeViewport.emit({ dimension, size: item.size });
          (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(item.scroll, dimension, true);
          // track scroll visibility on outer element change
          this.setScrollVisibility(dimension, item.size, item.contentSize);
        });
      },
    });
  }
  /**
   * Check if scroll present or not per type
   * Trigger this method on inner content size change or on outer element size change
   * If inner content bigger then outer size then scroll is present and mousewheel binding required
   * @param type - dimension type 'rgRow/y' or 'rgCol/x'
   * @param size - outer content size
   * @param innerContentSize - inner content size
   */
  setScrollVisibility(type, size, innerContentSize) {
    // test if scroll present
    const hasScroll = size < innerContentSize;
    let el;
    // event reference for binding
    let event;
    switch (type) {
      case 'rgCol':
        el = this.horizontalScroll;
        event = this.horizontalMouseWheel;
        break;
      case 'rgRow':
        el = this.verticalScroll;
        event = this.verticalMouseWheel;
        break;
    }
    // based on scroll visibility assign or remove class and event
    if (hasScroll) {
      el.classList.add(`scroll-${type}`);
      el.addEventListener('mousewheel', event);
    }
    else {
      el.classList.remove(`scroll-${type}`);
      el.removeEventListener('mousewheel', event);
    }
    this.scrollchange.emit({ type, hasScroll });
  }
  disconnectedCallback() {
    this.verticalScroll.removeEventListener('mousewheel', this.verticalMouseWheel);
    this.horizontalScroll.removeEventListener('mousewheel', this.horizontalMouseWheel);
    this.horisontalResize.destroy();
  }
  async componentDidRender() {
    // scroll update if number of rows changed
    if (this.contentHeight < this.oldValY && this.verticalScroll) {
      this.verticalScroll.scrollTop += this.contentHeight - this.oldValY;
    }
    this.oldValY = this.contentHeight;
    // scroll update if number of cols changed
    if (this.contentWidth < this.oldValX) {
      this.horizontalScroll.scrollLeft += this.contentWidth - this.oldValX;
    }
    this.oldValX = this.contentWidth;
    this.scrollService.setParams({
      contentSize: this.contentHeight,
      clientSize: this.verticalScroll.clientHeight,
      virtualSize: 0,
    }, 'rgRow');
    this.scrollService.setParams({
      contentSize: this.contentWidth,
      clientSize: this.horizontalScroll.clientWidth,
      virtualSize: 0,
    }, 'rgCol');
    this.setScrollVisibility('rgRow', this.verticalScroll.clientHeight, this.contentHeight);
    this.setScrollVisibility('rgCol', this.horizontalScroll.clientWidth, this.contentWidth);
  }
  render() {
    return (h(Host, { onScroll: (e) => this.onScroll('rgCol', e) },
      h("div", { class: "inner-content-table", style: { width: `${this.contentWidth}px` } },
        h("div", { class: "header-wrapper", ref: e => (this.header = e) },
          h("slot", { name: HEADER_SLOT })),
        h("div", { class: "vertical-inner", ref: el => (this.verticalScroll = el), onScroll: (e) => this.onScroll('rgRow', e) },
          h("div", { class: "content-wrapper", style: { height: `${this.contentHeight}px` } },
            h("slot", { name: CONTENT_SLOT }))),
        h("div", { class: "footer-wrapper", ref: e => (this.footer = e) },
          h("slot", { name: FOOTER_SLOT })))));
  }
  /**
   * Extra layer for scroll event monitoring, where MouseWheel event is not passing
   * We need to trigger scroll event in case there is no mousewheel event
   */
  onScroll(dimension, e) {
    var _a;
    const target = e.target;
    let scroll = 0;
    switch (dimension) {
      case 'rgCol':
        scroll = target === null || target === void 0 ? void 0 : target.scrollLeft;
        break;
      case 'rgRow':
        scroll = target === null || target === void 0 ? void 0 : target.scrollTop;
        break;
    }
    const change = new Date().getTime() - this.mouseWheelScroll[dimension];
    if (change > this.scrollThrottling) {
      (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(scroll, dimension);
    }
  }
  /** remember last mw event time */
  latestScrollUpdate(dimension) {
    this.mouseWheelScroll[dimension] = new Date().getTime();
  }
  /**
   * On vertical mousewheel event
   * @param type
   * @param delta
   * @param e
   */
  onVerticalMouseWheel(type, delta, e) {
    var _a;
    e.preventDefault();
    const pos = this.verticalScroll.scrollTop + e[delta];
    (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(pos, type, undefined, e[delta]);
    this.latestScrollUpdate(type);
  }
  /**
   * On horizontal mousewheel event
   * @param type
   * @param delta
   * @param e
   */
  onHorizontalMouseWheel(type, delta, e) {
    var _a;
    e.preventDefault();
    const pos = this.horizontalScroll.scrollLeft + e[delta];
    (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(pos, type, undefined, e[delta]);
    this.latestScrollUpdate(type);
  }
  static get is() { return "revogr-viewport-scroll"; }
  static get originalStyleUrls() { return {
    "$": ["revogr-viewport-scroll-style.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["revogr-viewport-scroll-style.css"]
  }; }
  static get properties() { return {
    "contentWidth": {
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
        "text": "Width of inner content"
      },
      "attribute": "content-width",
      "reflect": false,
      "defaultValue": "0"
    },
    "contentHeight": {
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
        "text": "Height of inner content"
      },
      "attribute": "content-height",
      "reflect": false,
      "defaultValue": "0"
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
      "method": "resizeViewport",
      "name": "resizeViewport",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "RevoGrid.ViewPortResizeEvent",
        "resolved": "{ dimension: DimensionType; size: number; }",
        "references": {
          "RevoGrid": {
            "location": "import",
            "path": "../../interfaces"
          }
        }
      }
    }, {
      "method": "scrollchange",
      "name": "scrollchange",
      "bubbles": true,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "{ type: RevoGrid.DimensionType; hasScroll: boolean; }",
        "resolved": "{ type: DimensionType; hasScroll: boolean; }",
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
            "tags": [{
                "text": "e",
                "name": "param"
              }],
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
        "text": "update on delta in case we don't know existing position or external change",
        "tags": [{
            "name": "param",
            "text": "e"
          }]
      }
    }
  }; }
  static get elementRef() { return "horizontalScroll"; }
}
