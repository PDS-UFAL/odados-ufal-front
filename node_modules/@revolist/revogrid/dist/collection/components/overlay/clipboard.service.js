import slice from 'lodash/slice';
import { h } from '@stencil/core';
import { getRange } from '../../store/selection/selection.helpers';
export class ClipboardService {
  constructor(sv) {
    this.sv = sv;
  }
  onCopy(e) {
    const canCopy = this.sv.internalCopy();
    if (canCopy.defaultPrevented) {
      return false;
    }
    let focus = this.sv.selectionStoreService.focused;
    let range = this.sv.selectionStoreService.ranged;
    let data;
    if (!range) {
      range = getRange(focus, focus);
    }
    if (range) {
      const columns = [...this.sv.columnService.columns];
      const props = slice(columns, range.x, range.x1 + 1).map(v => v.prop);
      data = this.sv.columnService.copyRangeArray(range, props, this.sv.dataStore);
    }
    this.clipboard.doCopy(e, data);
    return true;
  }
  renderClipboard() {
    return h("revogr-clipboard", { onCopyRegion: e => this.onCopy(e.detail), ref: e => (this.clipboard = e), onPasteRegion: e => this.onPaste(e.detail) });
  }
  onPaste(data) {
    const focus = this.sv.selectionStoreService.focused;
    const isEditing = this.sv.selectionStoreService.edited !== null;
    if (!focus || isEditing) {
      return;
    }
    const { changed, range } = this.sv.columnService.getTransformedDataToApply(focus, data);
    this.sv.onRangeApply(changed, range);
  }
}
