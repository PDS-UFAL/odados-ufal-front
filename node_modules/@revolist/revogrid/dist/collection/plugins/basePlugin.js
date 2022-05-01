export default class BasePlugin {
  constructor(revogrid) {
    this.revogrid = revogrid;
    this.subscriptions = {};
  }
  addEventListener(name, func) {
    this.revogrid.addEventListener(name, func);
    this.subscriptions[name] = func;
  }
  removeEventListener(type) {
    this.revogrid.removeEventListener(type, this.subscriptions[type]);
    delete this.subscriptions[type];
  }
  emit(eventName, detail) {
    const event = new CustomEvent(eventName, { detail: detail, cancelable: true });
    this.revogrid.dispatchEvent(event);
    return event;
  }
  clearSubscriptions() {
    for (let type in this.subscriptions) {
      this.removeEventListener(type);
    }
  }
  destroy() {
    this.clearSubscriptions();
  }
}
