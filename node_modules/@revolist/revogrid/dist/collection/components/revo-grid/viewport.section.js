import { h } from '@stencil/core';
import { UUID } from '../../utils/consts';
import { DATA_SLOT, HEADER_SLOT } from './viewport.helpers';
/**
 * All render based on sections
 * First we render vertical parts - pinned start, data, pinned end
 * Per each column we render data collections: headers, pinned top, center data, pinned bottom
 */
export const ViewPortSections = ({ resize, editors, rowClass, readonly, range, columns, useClipboard, columnFilter, registerElement, onEdit, onScroll }) => {
  const viewPortHtml = [];
  /** render viewports columns */
  for (let view of columns) {
    /** render viewports rows */
    const dataViews = [
      h("revogr-header", Object.assign({ viewportCol: view.viewportCol }, view.headerProp, { selectionStore: view.columnSelectionStore, slot: HEADER_SLOT, columnFilter: columnFilter, canResize: resize })),
    ];
    view.dataPorts.forEach((data, j) => {
      const key = view.prop.key + (j + 1);
      const dataView = (h("revogr-overlay-selection", Object.assign({}, data, { slot: data.slot, selectionStore: data.segmentSelectionStore, editors: editors, readonly: readonly, range: range, useClipboard: useClipboard, onSetEdit: ({ detail }) => onEdit(detail) }),
        h("revogr-data", Object.assign({}, data, { [UUID]: data.uuid }, { key: key, readonly: readonly, range: range, rowClass: rowClass, rowSelectionStore: data.rowSelectionStore, slot: DATA_SLOT })),
        h("revogr-temp-range", { selectionStore: data.segmentSelectionStore, dimensionRow: data.dimensionRow, dimensionCol: data.dimensionCol }),
        h("revogr-focus", { selectionStore: data.segmentSelectionStore, dimensionRow: data.dimensionRow, dimensionCol: data.dimensionCol })));
      dataViews.push(dataView);
    });
    viewPortHtml.push(h("revogr-viewport-scroll", Object.assign({}, view.prop, { ref: el => registerElement(el, view.prop.key), onScrollViewport: e => onScroll(e.detail, view.prop.key) }), dataViews));
  }
  return viewPortHtml;
};
