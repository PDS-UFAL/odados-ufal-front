interface Events {
  resize(entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver): void;
}
export default class GridResizeService {
  private events;
  private resizeObserver;
  private resize;
  constructor(el: HTMLElement, events: Events);
  init(el: HTMLElement): Promise<void>;
  destroy(): void;
}
export {};
