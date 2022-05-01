import { h } from '@stencil/core';
import OrderRenderer from '../order/orderRenderer';
export const RevoViewPort = ({ viewports, dimensions, orderRef, nakedClick, registerElement, onScroll }, children) => {
  const viewPortClick = (e, el) => {
    if (el === e.target) {
      nakedClick(e);
    }
  };
  let el;
  return [
    h("div", { class: "main-viewport", ref: e => el = e, onClick: e => viewPortClick(e, el) },
      h("div", { class: "viewports" },
        children,
        h("revogr-scroll-virtual", { class: "vertical", dimension: "rgRow", viewportStore: viewports['rgRow'].store, dimensionStore: dimensions['rgRow'].store, ref: el => registerElement(el, 'rowScroll'), onScrollVirtual: e => onScroll(e.detail) }),
        h(OrderRenderer, { ref: orderRef }))),
    h("revogr-scroll-virtual", { class: "horizontal", dimension: "rgCol", viewportStore: viewports['rgCol'].store, dimensionStore: dimensions['rgCol'].store, ref: el => registerElement(el, 'colScroll'), onScrollVirtual: e => onScroll(e.detail) }),
  ];
};
