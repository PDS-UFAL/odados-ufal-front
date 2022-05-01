import { getRange } from '../../store/selection/selection.helpers';
import { codesLetter } from '../../utils/keyCodes';
import { isClear, isCtrlKey, isEnterKey, isLetterKey } from '../../utils/keyCodes.utils';
import { timeout } from '../../utils/utils';
import { getCoordinate, isAfterLast, isBeforeFirst } from './selection.utils';
export class KeyboardService {
  constructor(sv) {
    this.sv = sv;
    this.ctrlDown = false;
  }
  async keyDown(e, canRange) {
    if (!this.sv.selectionStoreService.focused) {
      return;
    }
    if (isCtrlKey(e.keyCode, navigator.platform)) {
      this.ctrlDown = true;
    }
    // tab key means same as arrow right
    if (codesLetter.TAB === e.code) {
      this.keyChangeSelection(e, canRange);
      return;
    }
    /**
     *  IF EDIT MODE
     */
    if (this.sv.selectionStoreService.edited) {
      switch (e.code) {
        case codesLetter.ESCAPE:
          this.sv.doEdit(undefined, true);
          break;
      }
      return;
    }
    /**
     *  IF NOT EDIT MODE
     */
    // pressed clear key
    if (isClear(e.code)) {
      this.sv.clearCell();
      return;
    }
    // pressed enter
    if (isEnterKey(e.code)) {
      this.sv.doEdit();
      return;
    }
    // copy operation
    if (this.isCopy(e)) {
      return;
    }
    // paste operation
    if (this.isPaste(e)) {
      this.sv.internalPaste();
      return;
    }
    // pressed letter key
    if (isLetterKey(e.keyCode)) {
      this.sv.doEdit(e.key);
      return;
    }
    // pressed arrow, change selection position
    if (await this.keyChangeSelection(e, canRange)) {
      return;
    }
  }
  async keyChangeSelection(e, canRange) {
    const data = this.changeDirectionKey(e, canRange);
    if (!data) {
      return false;
    }
    await timeout();
    const range = this.sv.selectionStore.get('range');
    const focus = this.sv.selectionStore.get('focus');
    return this.keyPositionChange(data.changes, this.sv.getData(), range, focus, data.isMulti);
  }
  keyPositionChange(changes, eData, range, focus, isMulti = false) {
    if (!range || !focus) {
      return false;
    }
    const data = getCoordinate(range, focus, changes, isMulti);
    if (!data) {
      return false;
    }
    if (isMulti) {
      if (isAfterLast(data.end, eData) || isBeforeFirst(data.start)) {
        return false;
      }
      const range = getRange(data.start, data.end);
      return this.sv.selectionStoreService.changeRange(range);
    }
    return this.sv.selectionStoreService.focus(data.start);
  }
  keyUp(e) {
    if (isCtrlKey(e.keyCode, navigator.platform)) {
      this.ctrlDown = false;
    }
  }
  isCopy(e) {
    return this.ctrlDown && e.code == codesLetter.C;
  }
  isPaste(e) {
    return this.ctrlDown && e.code == codesLetter.V;
  }
  /** Monitor key direction changes */
  changeDirectionKey(e, canRange) {
    const isMulti = canRange && e.shiftKey;
    switch (e.code) {
      case codesLetter.TAB:
      case codesLetter.ARROW_UP:
      case codesLetter.ARROW_DOWN:
      case codesLetter.ARROW_LEFT:
      case codesLetter.ARROW_RIGHT:
        e.preventDefault();
        break;
    }
    switch (e.code) {
      case codesLetter.ARROW_UP:
        return { changes: { y: -1 }, isMulti };
      case codesLetter.ARROW_DOWN:
        return { changes: { y: 1 }, isMulti };
      case codesLetter.ARROW_LEFT:
        return { changes: { x: -1 }, isMulti };
      case codesLetter.TAB:
      case codesLetter.ARROW_RIGHT:
        return { changes: { x: 1 }, isMulti };
    }
  }
}
