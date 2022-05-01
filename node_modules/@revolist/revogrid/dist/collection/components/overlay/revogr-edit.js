import { Component, Event, Prop, h, Element, Host } from '@stencil/core';
import { EDIT_INPUT_WR } from '../../utils/consts';
import { TextEditor } from './editors/text';
export class Edit {
  constructor() {
    this.currentEditor = null;
  }
  /** Callback triggered on cell editor save */
  onSave(val, preventFocus) {
    if (this.editCell) {
      this.cellEdit.emit({
        rgCol: this.editCell.x,
        rgRow: this.editCell.y,
        val,
        preventFocus,
      });
    }
  }
  componentWillRender() {
    if (!this.currentEditor) {
      if (this.editor) {
        this.currentEditor = new this.editor(this.column, (e, preventFocus) => this.onSave(e, preventFocus), focusNext => this.closeEdit.emit(focusNext));
      }
      else {
        this.currentEditor = new TextEditor(this.column, (e, preventFocus) => this.onSave(e, preventFocus));
      }
    }
  }
  componentDidRender() {
    if (!this.currentEditor) {
      return;
    }
    this.currentEditor.element = this.element.firstElementChild;
    this.currentEditor.componentDidRender && this.currentEditor.componentDidRender();
  }
  disconnectedCallback() {
    if (!this.currentEditor) {
      return;
    }
    this.currentEditor.disconnectedCallback && this.currentEditor.disconnectedCallback();
    if (this.currentEditor.element) {
      this.currentEditor.element = null;
    }
    this.currentEditor = null;
  }
  render() {
    if (this.currentEditor) {
      this.currentEditor.editCell = this.editCell;
      return h(Host, { class: EDIT_INPUT_WR }, this.currentEditor.render(h));
    }
    return '';
  }
  static get is() { return "revogr-edit"; }
  static get originalStyleUrls() { return {
    "$": ["revogr-edit-style.scss"]
  }; }
  static get styleUrls() { return {
    "$": ["revogr-edit-style.css"]
  }; }
  static get properties() { return {
    "editCell": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Edition.EditCell",
        "resolved": "EditCellStore & BeforeSaveDataDetails",
        "references": {
          "Edition": {
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
    "column": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "RevoGrid.ColumnRegular | null",
        "resolved": "ColumnRegular",
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
    "editor": {
      "type": "unknown",
      "mutable": false,
      "complexType": {
        "original": "Edition.EditorCtr | null",
        "resolved": "EditorCtr",
        "references": {
          "Edition": {
            "location": "import",
            "path": "../../interfaces"
          }
        }
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": "Custom editors register"
      }
    }
  }; }
  static get events() { return [{
      "method": "cellEdit",
      "name": "cellEdit",
      "bubbles": false,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": ""
      },
      "complexType": {
        "original": "Edition.SaveDataDetails",
        "resolved": "{ rgRow: number; rgCol: number; val: any; preventFocus?: boolean; }",
        "references": {
          "Edition": {
            "location": "import",
            "path": "../../interfaces"
          }
        }
      }
    }, {
      "method": "closeEdit",
      "name": "closeEdit",
      "bubbles": false,
      "cancelable": true,
      "composed": true,
      "docs": {
        "tags": [],
        "text": "Close editor event"
      },
      "complexType": {
        "original": "boolean | undefined",
        "resolved": "boolean",
        "references": {}
      }
    }]; }
  static get elementRef() { return "element"; }
}
