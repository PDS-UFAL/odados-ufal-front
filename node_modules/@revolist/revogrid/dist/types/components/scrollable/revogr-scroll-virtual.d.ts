import { EventEmitter } from '../../stencil-public-runtime';
import { Observable, RevoGrid } from '../../interfaces';
export declare class RevogrScrollVirtual {
  private scrollSize;
  private isAutoHide;
  private autoHideTimeout;
  private scrollService;
  element: HTMLElement;
  dimension: RevoGrid.DimensionType;
  viewportStore: Observable<RevoGrid.ViewportState>;
  dimensionStore: Observable<RevoGrid.DimensionSettingsState>;
  scrollVirtual: EventEmitter<RevoGrid.ViewPortScrollEvent>;
  setScroll(e: RevoGrid.ViewPortScrollEvent): Promise<void>;
  changeScroll(e: RevoGrid.ViewPortScrollEvent): Promise<RevoGrid.ViewPortScrollEvent>;
  set size(s: number);
  get size(): number;
  connectedCallback(): void;
  disconnectedCallback(): void;
  componentWillLoad(): void;
  componentDidRender(): void;
  onScroll(e: MouseEvent): void;
  autoHide(timeout?: number): number;
  render(): any;
  private extContentSize;
}
