import throttle from 'lodash/throttle';
import { resizeObserver } from '../../utils/resizeObserver';
export default class GridResizeService {
  constructor(el, events) {
    this.events = events;
    this.resizeObserver = null;
    this.resize = throttle((e, o) => { var _a; return (_a = this.events) === null || _a === void 0 ? void 0 : _a.resize(e, o); }, 10);
    this.init(el);
  }
  async init(el) {
    var _a;
    await resizeObserver();
    this.resizeObserver = new ResizeObserver(this.resize);
    (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.observe(el);
  }
  destroy() {
    var _a;
    (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
    this.resizeObserver = null;
  }
}
