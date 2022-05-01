import { h } from '@stencil/core';
import { ResizableElement } from '../../services/resizable.directive';
import ColumnService from '../data/columnService';
export const HeaderCellRenderer = ({ data, props }, children) => {
  let colTemplate = (data === null || data === void 0 ? void 0 : data.name) || '';
  let cellProps = props;
  if (data === null || data === void 0 ? void 0 : data.columnTemplate) {
    colTemplate = data.columnTemplate(h, data);
  }
  if (data === null || data === void 0 ? void 0 : data.columnProperties) {
    const extra = data.columnProperties(data);
    if (extra && typeof extra === 'object') {
      cellProps = ColumnService.doMerge(props, extra);
    }
  }
  return (h(ResizableElement, Object.assign({}, cellProps),
    h("div", { class: "header-content" }, colTemplate),
    children));
};
