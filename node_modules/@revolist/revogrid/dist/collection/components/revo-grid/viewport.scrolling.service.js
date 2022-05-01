export default class GridScrollingService {
  constructor(setViewport) {
    this.setViewport = setViewport;
    this.elements = {};
  }
  async onScroll(e, key) {
    let newEvent;
    for (let elKey in this.elements) {
      if (this.isPinnedColumn(key) && e.dimension === 'rgCol') {
        if (elKey === key || !e.delta) {
          continue;
        }
        for (let el of this.elements[elKey]) {
          el.changeScroll && (newEvent = el.changeScroll(e));
        }
      }
      else if (e.dimension === 'rgCol' && elKey === 'headerRow') {
        continue;
      }
      else {
        for (let el of this.elements[elKey]) {
          el.setScroll(e);
        }
      }
    }
    let event = e;
    if (newEvent) {
      event = await newEvent;
    }
    this.setViewport(event);
  }
  isPinnedColumn(key) {
    return ['colPinStart', 'colPinEnd'].indexOf(key) > -1;
  }
  registerElements(els) {
    this.elements = els;
  }
  /**
   * Register new element for farther scroll support
   * @param el - can be null if holder removed
   * @param key - element key
   */
  registerElement(el, key) {
    if (!this.elements[key]) {
      this.elements[key] = [];
    }
    // new element added
    if (el) {
      this.elements[key].push(el);
    }
    else if (this.elements[key]) {
      // element removed
      delete this.elements[key];
    }
  }
  unregister() {
    delete this.elements;
    this.elements = {};
  }
}
