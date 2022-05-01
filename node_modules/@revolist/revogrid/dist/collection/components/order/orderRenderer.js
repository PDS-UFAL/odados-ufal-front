import { h } from '@stencil/core';
/**
 * Draw drag
 */
export class OrdererService {
  constructor() {
    this.parentY = 0;
  }
  start(parent, { pos, text, event }) {
    var _a;
    const { top } = parent.getBoundingClientRect();
    this.parentY = top;
    if (this.text) {
      this.text.innerText = text;
    }
    this.move(pos);
    this.moveTip({ x: event.x, y: event.y });
    (_a = this.el) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
  }
  end() {
    var _a;
    (_a = this.el) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
  }
  move(pos) {
    this.moveElement(pos.end - this.parentY);
  }
  moveTip({ x, y }) {
    if (!this.draggable) {
      return;
    }
    this.draggable.style.left = `${x}px`;
    this.draggable.style.top = `${y}px`;
  }
  moveElement(y) {
    if (!this.rgRow) {
      return;
    }
    this.rgRow.style.transform = `translateY(${y}px)`;
  }
}
const OrderRenderer = ({ ref }) => {
  const service = new OrdererService();
  ref(service);
  return (h("div", { class: "draggable-wrapper hidden", ref: e => (service.el = e) },
    h("div", { class: "draggable", ref: el => (service.draggable = el) },
      h("span", { class: "revo-alt-icon" }),
      h("span", { ref: e => (service.text = e) })),
    h("div", { class: "drag-position", ref: e => (service.rgRow = e) })));
};
export default OrderRenderer;
