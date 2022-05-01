import { h } from '@stencil/core';
import findIndex from 'lodash/findIndex';
import { getItemByIndex } from '../../store/dimension/dimension.helpers';
import { HEADER_ROW_CLASS } from '../../utils/consts';
import GroupHeaderRenderer from './headerGroupRenderer';
const ColumnGroupsRenderer = ({ depth, groups, visibleProps, dimensionCol, canResize, onResize }) => {
  // render group columns
  const groupRow = [];
  for (let i = 0; i < depth; i++) {
    if (groups[i]) {
      for (let group of groups[i]) {
        // if group in visible range
        // find first visible group prop in visible columns range
        const indexFirstVisibleCol = findIndex(group.ids, id => typeof visibleProps[id] === 'number');
        if (indexFirstVisibleCol > -1) {
          const colVisibleIndex = visibleProps[group.ids[indexFirstVisibleCol]]; // get column index
          const groupStartIndex = colVisibleIndex - indexFirstVisibleCol; // first column index in group
          const groupEndIndex = groupStartIndex + group.ids.length - 1; // last column index in group
          // coordinates
          const groupStart = getItemByIndex(dimensionCol, groupStartIndex).start;
          const groupEnd = getItemByIndex(dimensionCol, groupEndIndex).end;
          groupRow.push(h(GroupHeaderRenderer, { start: groupStart, end: groupEnd, group: group, canResize: canResize, onResize: e => onResize(e.changedX, groupStartIndex, groupEndIndex) }));
        }
      }
    }
    groupRow.push(h("div", { class: `${HEADER_ROW_CLASS} group` }));
  }
  return groupRow;
};
export default ColumnGroupsRenderer;
