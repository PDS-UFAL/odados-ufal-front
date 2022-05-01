import { h } from '@stencil/core';
var ResizeEvents;
(function (ResizeEvents) {
  ResizeEvents["start"] = "resize:start";
  ResizeEvents["move"] = "resize:move";
  ResizeEvents["end"] = "resize:end";
})(ResizeEvents || (ResizeEvents = {}));
const RESIZE_MASK = {
  'resizable-r': { bit: 0b0001, cursor: 'ew-resize' },
  'resizable-rb': { bit: 0b0011, cursor: 'se-resize' },
  'resizable-b': { bit: 0b0010, cursor: 's-resize' },
  'resizable-lb': { bit: 0b0110, cursor: 'sw-resize' },
  'resizable-l': { bit: 0b0100, cursor: 'w-resize' },
  'resizable-lt': { bit: 0b1100, cursor: 'nw-resize' },
  'resizable-t': { bit: 0b1000, cursor: 'n-resize' },
  'resizable-rt': { bit: 0b1001, cursor: 'ne-resize' },
};
const DISABLE_MASK = {
  l: 0b0001,
  t: 0b0010,
  w: 0b0100,
  h: 0b1000,
};
const defaultProps = (props) => {
  return Object.assign(Object.assign({}, props), { fitParent: props.fitParent || false, active: props.active || [], disableAttributes: props.disableAttributes || [], minWidth: props.minWidth || 0, minHeight: props.minHeight || 0 });
};
export class ResizeDirective {
  constructor(initialProps, $event) {
    this.initialProps = initialProps;
    this.$event = $event;
    this.mouseX = 0;
    this.mouseY = 0;
    this.width = 0;
    this.height = 0;
    this.changeX = 0;
    this.changeY = 0;
    this.disableCalcMap = 0b1111;
    this.props = defaultProps(initialProps);
    this.mouseMoveFunc = this.handleMove.bind(this);
    this.mouseUpFunc = this.handleUp.bind(this);
    this.minW = this.props.minWidth;
    this.minH = this.props.minHeight;
    this.maxW = this.props.maxWidth;
    this.maxH = this.props.maxHeight;
    this.parent = { width: 0, height: 0 };
    this.resizeState = 0;
  }
  set($el) {
    this.$el = $el;
    this.props.disableAttributes.forEach(attr => {
      switch (attr) {
        case 'l':
          this.disableCalcMap &= ~DISABLE_MASK.l;
          break;
        case 't':
          this.disableCalcMap &= ~DISABLE_MASK.t;
          break;
        case 'w':
          this.disableCalcMap &= ~DISABLE_MASK.w;
          break;
        case 'h':
          this.disableCalcMap &= ~DISABLE_MASK.h;
      }
    });
  }
  emitEvent(eventName, additionalOptions) {
    if (!this.$event) {
      return;
    }
    this.$event(Object.assign({ eventName, width: this.width + this.changeX, height: this.height + this.changeY, changedX: this.changeX, changedY: this.changeY }, additionalOptions));
  }
  static isTouchEvent(e) {
    var _a;
    const event = e;
    return ((_a = event.touches) === null || _a === void 0 ? void 0 : _a.length) >= 0;
  }
  handleMove(event) {
    if (!this.resizeState) {
      return;
    }
    let eventY, eventX;
    if (ResizeDirective.isTouchEvent(event)) {
      eventY = event.touches[0].clientY;
      eventX = event.touches[0].clientX;
    }
    else {
      eventY = event.clientY;
      eventX = event.clientX;
    }
    let isX = this.resizeState & RESIZE_MASK['resizable-r'].bit || this.resizeState & RESIZE_MASK['resizable-l'].bit;
    let isY = this.resizeState & RESIZE_MASK['resizable-t'].bit || this.resizeState & RESIZE_MASK['resizable-b'].bit;
    if (isY && this.disableCalcMap & DISABLE_MASK.h) {
      let diffY = eventY - this.mouseY;
      let changedY = this.changeY + diffY;
      const newHeight = this.height + changedY;
      // if overcrossed min height
      if (newHeight < this.minH) {
        changedY = -(this.height - this.minH);
      }
      // if overcrossed max heiht
      if (this.maxH && newHeight > this.maxH) {
        changedY = this.maxH - this.height;
      }
      this.changeY = changedY;
      this.mouseY = eventY;
      if (this.activeResizer) {
        this.activeResizer.style.bottom = `${-this.changeY}px`;
      }
    }
    if (isX && this.disableCalcMap & DISABLE_MASK.w) {
      let diffX = eventX - this.mouseX;
      let changedX = this.changeX + diffX;
      const newWidth = this.width + changedX;
      // if overcrossed min width
      if (newWidth < this.minW) {
        changedX = -(this.width - this.minW);
      }
      // if overcrossed max width
      if (this.maxW && newWidth > this.maxW) {
        changedX = this.maxW - this.width;
      }
      this.changeX = changedX;
      this.mouseX = eventX;
      if (this.activeResizer) {
        this.activeResizer.style.right = `${-this.changeX}px`;
      }
    }
    this.emitEvent(ResizeEvents.move);
  }
  handleDown(event) {
    if (event.defaultPrevented) {
      return;
    }
    this.dropInitial();
    for (let elClass in RESIZE_MASK) {
      const target = event.target;
      if (this.$el.contains(target) && (target === null || target === void 0 ? void 0 : target.classList.contains(elClass))) {
        document.body.style.cursor = RESIZE_MASK[elClass].cursor;
        if (ResizeDirective.isTouchEvent(event)) {
          this.setInitials(event.touches[0], target);
        }
        else {
          event.preventDefault && event.preventDefault();
          this.setInitials(event, target);
        }
        this.resizeState = RESIZE_MASK[elClass].bit;
        const eventName = ResizeEvents.start;
        this.emitEvent(eventName);
        break;
      }
    }
    this.bindMove();
  }
  handleUp(e) {
    e.preventDefault();
    if (this.resizeState !== 0) {
      this.resizeState = 0;
      document.body.style.cursor = '';
      const eventName = ResizeEvents.end;
      this.emitEvent(eventName);
    }
    this.dropInitial();
    this.unbindMove();
  }
  setInitials({ clientX, clientY }, target) {
    const computedStyle = getComputedStyle(this.$el);
    this.$el.classList.add('active');
    this.activeResizer = target;
    if (this.disableCalcMap & DISABLE_MASK.w) {
      this.mouseX = clientX;
      this.width = this.$el.clientWidth;
      this.parent.width = this.$el.parentElement.clientWidth;
      // min width
      const minPaddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
      this.minW = Math.max(minPaddingX, this.initialProps.minWidth || 0);
      // max width
      if (this.initialProps.maxWidth) {
        this.maxW = Math.max(this.width, this.initialProps.maxWidth);
      }
    }
    if (this.disableCalcMap & DISABLE_MASK.h) {
      this.mouseY = clientY;
      this.height = this.$el.clientHeight;
      this.parent.height = this.$el.parentElement.clientHeight;
      // min height
      const minPaddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
      this.minH = Math.max(minPaddingY, this.initialProps.minHeight || 0);
      // max height
      if (this.initialProps.maxHeight) {
        this.maxH = Math.max(this.height, this.initialProps.maxHeight);
      }
    }
  }
  dropInitial() {
    this.changeX = this.changeY = this.minW = this.minH;
    this.width = this.height = 0;
    if (this.activeResizer) {
      this.activeResizer.removeAttribute('style');
    }
    this.$el.classList.remove('active');
    this.activeResizer = null;
  }
  bindMove() {
    document.documentElement.addEventListener('mouseup', this.mouseUpFunc, true);
    document.documentElement.addEventListener('touchend', this.mouseUpFunc, true);
    document.documentElement.addEventListener('mousemove', this.mouseMoveFunc, true);
    document.documentElement.addEventListener('touchmove', this.mouseMoveFunc, true);
    document.documentElement.addEventListener('mouseleave', this.mouseUpFunc);
  }
  unbindMove() {
    document.documentElement.removeEventListener('mouseup', this.mouseUpFunc, true);
    document.documentElement.removeEventListener('touchend', this.mouseUpFunc, true);
    document.documentElement.removeEventListener('mousemove', this.mouseMoveFunc, true);
    document.documentElement.removeEventListener('touchmove', this.mouseMoveFunc, true);
    document.documentElement.removeEventListener('mouseleave', this.mouseUpFunc);
  }
}
export const ResizableElement = (props, children) => {
  const resizeEls = [];
  const directive = (props.canResize &&
    new ResizeDirective(props, e => {
      if (e.eventName === ResizeEvents.end) {
        props.onResize && props.onResize(e);
      }
    })) ||
    null;
  if (props.canResize) {
    if (props.active) {
      for (let p in props.active) {
        resizeEls.push(h("div", { onClick: e => e.preventDefault(), onDblClick: e => {
            e.preventDefault();
            props.onDoubleClick && props.onDoubleClick();
          }, onMouseDown: (e) => directive === null || directive === void 0 ? void 0 : directive.handleDown(e), onTouchStart: (e) => directive === null || directive === void 0 ? void 0 : directive.handleDown(e), class: `resizable resizable-${props.active[p]}` }));
      }
    }
  }
  else {
    if (props.active) {
      for (let p in props.active) {
        resizeEls.push(h("div", { onClick: e => e.preventDefault(), onDblClick: e => {
            e.preventDefault();
            props.onDoubleClick && props.onDoubleClick();
          }, class: `no-resize resizable resizable-${props.active[p]}` }));
      }
    }
  }
  return (h("div", Object.assign({}, props, { ref: (e) => directive === null || directive === void 0 ? void 0 : directive.set(e) }),
    children,
    resizeEls));
};
