import { h } from '@stencil/core';
import { HEADER_CLASS, MIN_COL_SIZE } from '../../utils/consts';
import { HeaderCellRenderer } from '../../components/header/headerCellRenderer';
const GroupHeaderRenderer = (p) => {
  const groupProps = {
    canResize: p.canResize,
    minWidth: p.group.ids.length * MIN_COL_SIZE,
    maxWidth: 0,
    active: ['r'],
    class: {
      [HEADER_CLASS]: true,
    },
    style: {
      transform: `translateX(${p.start}px)`,
      width: `${p.end - p.start}px`,
    },
    onResize: p.onResize,
  };
  return h(HeaderCellRenderer, { data: p.group, props: groupProps });
};
export default GroupHeaderRenderer;
