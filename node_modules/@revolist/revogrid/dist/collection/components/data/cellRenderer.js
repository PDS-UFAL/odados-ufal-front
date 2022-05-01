import { h } from '@stencil/core';
import ColumnService from './columnService';
import { DRAG_ICON_CLASS, DRAGGABLE_CLASS } from '../../utils/consts';
const CellRenderer = ({ model, canDrag, onDragStart }) => {
  const els = [];
  if (model.column.rowDrag && isRowDragService(model.column.rowDrag, model)) {
    if (canDrag) {
      els.push(h("span", { class: DRAGGABLE_CLASS, onMouseDown: e => onDragStart(e) },
        h("span", { class: DRAG_ICON_CLASS })));
    }
    else {
      els.push(h("span", { class: DRAGGABLE_CLASS }));
    }
  }
  els.push(`${ColumnService.getData(model.model[model.prop])}`);
  return els;
};
export default CellRenderer;
function isRowDragService(rowDrag, model) {
  if (typeof rowDrag === 'function') {
    return rowDrag(model);
  }
  return !!rowDrag;
}
