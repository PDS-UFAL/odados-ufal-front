import { h } from '@stencil/core';
import { FilterButton } from '../../plugins/filter/filter.button';
import { SortingSign } from '../../plugins/sorting/sorting.sign';
import { DATA_COL, FOCUS_CLASS, HEADER_CLASS, HEADER_SORTABLE_CLASS, MIN_COL_SIZE } from '../../utils/consts';
import { HeaderCellRenderer } from './headerCellRenderer';
const HeaderRenderer = (p) => {
  var _a, _b, _c, _d, _e, _f;
  const cellClass = {
    [HEADER_CLASS]: true,
    [HEADER_SORTABLE_CLASS]: !!((_a = p.data) === null || _a === void 0 ? void 0 : _a.sortable),
  };
  if ((_b = p.data) === null || _b === void 0 ? void 0 : _b.order) {
    cellClass[p.data.order] = true;
  }
  const dataProps = {
    [DATA_COL]: p.column.itemIndex,
    canResize: p.canResize,
    minWidth: ((_c = p.data) === null || _c === void 0 ? void 0 : _c.minSize) || MIN_COL_SIZE,
    maxWidth: (_d = p.data) === null || _d === void 0 ? void 0 : _d.maxSize,
    active: ['r'],
    class: cellClass,
    style: { width: `${p.column.size}px`, transform: `translateX(${p.column.start}px)` },
    onResize: p.onResize,
    onDoubleClick(originalEvent) {
      p.onDoubleClick({ column: p.data, index: p.column.itemIndex, originalEvent });
    },
    onClick(originalEvent) {
      if (originalEvent.defaultPrevented || !p.onClick) {
        return;
      }
      p.onClick({ column: p.data, index: p.column.itemIndex, originalEvent });
    },
  };
  if (p.range) {
    if (p.column.itemIndex >= p.range.x && p.column.itemIndex <= p.range.x1) {
      if (typeof dataProps.class === 'object') {
        dataProps.class[FOCUS_CLASS] = true;
      }
    }
  }
  return (h(HeaderCellRenderer, { data: p.data, props: dataProps },
    ((_e = p.data) === null || _e === void 0 ? void 0 : _e.order) ? h(SortingSign, { column: p.data }) : '',
    p.canFilter && ((_f = p.data) === null || _f === void 0 ? void 0 : _f.filter) !== false ? h(FilterButton, { column: p.data }) : ''));
};
export default HeaderRenderer;
