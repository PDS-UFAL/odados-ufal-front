import debounce from 'lodash/debounce';
import each from 'lodash/each';
import slice from 'lodash/slice';
import { h } from '@stencil/core';
import { CELL_HANDLER_CLASS } from '../../utils/consts';
import { getCell, getCurrentCell, getDirectionCoordinate, getLargestAxis, isAfterLast } from './selection.utils';
import { getRange } from '../../store/selection/selection.helpers';
import { getSourceItem } from '../../store/dataSource/data.store';
var AutoFillType;
(function (AutoFillType) {
  AutoFillType["selection"] = "Selection";
  AutoFillType["autoFill"] = "AutoFill";
})(AutoFillType || (AutoFillType = {}));
export class AutoFillService {
  constructor(sv) {
    this.sv = sv;
    this.autoFillType = null;
    this.autoFillInitial = null;
    this.autoFillStart = null;
    this.autoFillLast = null;
  }
  /**
   * Render autofill box
   * @param range
   * @param selectionFocus
   */
  renderAutofill(range, selectionFocus) {
    let handlerStyle;
    if (range) {
      handlerStyle = getCell(range, this.sv.dimensionRow.state, this.sv.dimensionCol.state);
    }
    else {
      handlerStyle = getCell(Object.assign(Object.assign({}, selectionFocus), { x1: selectionFocus.x, y1: selectionFocus.y }), this.sv.dimensionRow.state, this.sv.dimensionCol.state);
    }
    return (h("div", { class: CELL_HANDLER_CLASS, style: { left: `${handlerStyle.right}px`, top: `${handlerStyle.bottom}px` }, onMouseDown: (e) => this.selectionStart(e, this.sv.getData(), AutoFillType.autoFill) }));
  }
  get isAutoFill() {
    return !!this.autoFillType;
  }
  /** Process mouse move events */
  selectionMouseMove(e) {
    // initiate mouse move debounce if not present
    if (!this.onMouseMoveAutofill) {
      this.onMouseMoveAutofill = debounce((e, data) => this.doAutofillMouseMove(e, data), 5);
    }
    if (this.isAutoFill) {
      this.onMouseMoveAutofill(e, this.sv.getData());
    }
  }
  getFocus() {
    let focus = this.sv.selectionStoreService.focused;
    const range = this.sv.selectionStoreService.ranged;
    if (range) {
      focus = { x: range.x, y: range.y };
    }
    if (!focus && !range) {
      return null;
    }
    return focus;
  }
  /**
   * Autofill logic:
   * on mouse move apply based on previous direction (if present)
   */
  doAutofillMouseMove({ x, y }, data) {
    if (!this.autoFillInitial) {
      return;
    }
    let current = getCurrentCell({ x, y }, data);
    let direction;
    if (this.autoFillLast) {
      direction = getDirectionCoordinate(this.autoFillStart, this.autoFillLast);
    }
    // first time or direction equal to start(same as first time)
    if (!this.autoFillLast || !direction) {
      direction = getLargestAxis(this.autoFillStart, current);
      if (!this.autoFillLast) {
        this.autoFillLast = this.autoFillStart;
      }
    }
    // nothing changed
    if (!direction) {
      return;
    }
    each(direction, (v, k) => {
      if (v) {
        current = Object.assign(Object.assign({}, this.autoFillLast), { [k]: current[k] });
      }
    });
    // check if not the latest
    if (isAfterLast(current, data)) {
      return;
    }
    this.autoFillLast = current;
    this.sv.setTempRange({
      area: getRange(this.autoFillInitial, this.autoFillLast),
      type: this.autoFillType,
    });
  }
  /**
   * Range selection started
   * Mode @param type:
   * Can be triggered from MouseDown selection on element
   * Or can be triggered on corner square drag
   */
  selectionStart(e, data, type = AutoFillType.selection) {
    /** Get cell by autofill element */
    const { top, left } = e.target.getBoundingClientRect();
    this.autoFillInitial = this.getFocus();
    this.autoFillType = type;
    this.autoFillStart = getCurrentCell({ x: left, y: top }, data);
    e.preventDefault();
  }
  /** Clear current range selection */
  clearAutoFillSelection() {
    // Apply autofill values on mouse up
    if (this.autoFillInitial) {
      // Get latest
      this.autoFillInitial = this.getFocus();
      if (this.autoFillType === AutoFillType.autoFill) {
        this.applyRangeWithData(this.autoFillInitial, this.autoFillLast);
      }
      else {
        this.applyRangeOnly(this.autoFillInitial, this.autoFillLast);
      }
    }
    this.autoFillType = null;
    this.autoFillInitial = null;
    this.autoFillLast = null;
    this.autoFillStart = null;
  }
  /** Trigger range apply events and handle responses */
  onRangeApply(data, range) {
    const models = {};
    for (let rowIndex in data) {
      models[rowIndex] = getSourceItem(this.sv.dataStore, parseInt(rowIndex, 10));
    }
    const dataEvent = this.sv.internalRangeDataApply({
      data,
      models,
      type: this.sv.dataStore.get('type'),
    });
    if (!dataEvent.defaultPrevented) {
      this.sv.columnService.applyRangeData(data);
    }
    this.sv.setRange(range);
  }
  /** Apply range and copy data during range application */
  applyRangeWithData(start, end) {
    // no changes to apply
    if (!start || !end) {
      return;
    }
    const oldRange = this.sv.selectionStoreService.ranged;
    const newRange = getRange(start, end);
    const columns = [...this.sv.columnService.columns];
    const rangeData = {
      type: this.sv.dataStore.get('type'),
      newData: {},
      newRange,
      oldRange,
      newProps: slice(columns, newRange.x, newRange.x1 + 1).map(v => v.prop),
      oldProps: slice(columns, oldRange.x, oldRange.x1 + 1).map(v => v.prop),
    };
    rangeData.newData = this.sv.columnService.getRangeData(rangeData);
    const selectionEndEvent = this.sv.internalSelectionChanged(rangeData);
    if (selectionEndEvent.defaultPrevented) {
      this.sv.setTempRange(null);
      return;
    }
    this.onRangeApply(rangeData.newData, newRange);
  }
  /** Update range selection ony, no data change (mouse selection) */
  applyRangeOnly(start, end) {
    // no changes to apply
    if (!start || !end) {
      return;
    }
    const newRange = getRange(start, end);
    this.sv.setRange(newRange);
  }
}
