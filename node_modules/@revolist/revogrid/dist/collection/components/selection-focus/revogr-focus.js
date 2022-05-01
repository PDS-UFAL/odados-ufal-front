import { Component, Prop, h, Host, Element } from '@stencil/core';
import { FOCUS_CLASS } from '../../utils/consts';
import { getElStyle } from '../overlay/selection.utils';
export class RevogrFocus {
  changed(e) {
    e === null || e === void 0 ? void 0 : e.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }
  componentDidRender() {
    this.el && this.changed(this.el);
  }
  render() {
    const data = this.selectionStore.get('focus');
    if (data) {
      const style = getElStyle(Object.assign(Object.assign({}, data), { x1: data.x, y1: data.y }), this.dimensionRow.state, this.dimensionCol.state);
      return h(Host, { class: FOCUS_CLASS, style: style });
    }
  }
  static get is() { return "revogr-focus"; }
  static get originalStyleUrls() { return {
    "$": ["revogr-focus-style.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["revogr-focus-style.css"]
  }; }
  static get properties() { return {
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
        "text": "Dynamic stores"
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
    }
  }; }
  static get elementRef() { return "el"; }
}
