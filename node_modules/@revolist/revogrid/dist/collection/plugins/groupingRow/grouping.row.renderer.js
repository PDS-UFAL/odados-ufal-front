import { h } from '@stencil/core';
import RowRenderer from '../../components/data/rowRenderer';
import { GROUP_DEPTH, GROUP_EXPANDED, GROUP_EXPAND_BTN, GROUP_EXPAND_EVENT, PSEUDO_GROUP_ITEM } from './grouping.const';
function expandEvent(e, model, virtualIndex) {
  const event = new CustomEvent(GROUP_EXPAND_EVENT, {
    detail: {
      model,
      virtualIndex,
    },
    cancelable: true,
    bubbles: true,
  });
  e.target.dispatchEvent(event);
}
const GroupingRowRenderer = (props) => {
  const { model, itemIndex, hasExpand } = props;
  const name = model[PSEUDO_GROUP_ITEM];
  const expanded = model[GROUP_EXPANDED];
  const depth = parseInt(model[GROUP_DEPTH], 10) || 0;
  if (!hasExpand) {
    return h(RowRenderer, Object.assign({}, props, { rowClass: "groupingRow", depth: depth }));
  }
  return (h(RowRenderer, Object.assign({}, props, { rowClass: "groupingRow", depth: depth }),
    h("button", { class: { [GROUP_EXPAND_BTN]: true }, onClick: e => expandEvent(e, model, itemIndex) },
      h("svg", { "aria-hidden": "true", style: { transform: `rotate(${!expanded ? -90 : 0}deg)` }, focusable: "false", viewBox: "0 0 448 512" },
        h("path", { fill: "currentColor", d: "M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" }))),
    name));
};
export default GroupingRowRenderer;
