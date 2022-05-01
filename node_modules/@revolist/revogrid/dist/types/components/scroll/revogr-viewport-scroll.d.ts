import { EventEmitter } from '../../stencil-public-runtime';
import { RevoGrid } from '../../interfaces';
/**
 * Service for tracking grid scrolling
 */
export declare class RevogrViewportScroll {
  scrollViewport: EventEmitter<RevoGrid.ViewPortScrollEvent>;
  resizeViewport: EventEmitter<RevoGrid.ViewPortResizeEvent>;
  scrollchange: EventEmitter<{
    type: RevoGrid.DimensionType;
    hasScroll: boolean;
  }>;
  private scrollThrottling;
  /**
   * Width of inner content
   */
  contentWidth: number;
  /**
   * Height of inner content
   */
  contentHeight: number;
  private oldValY;
  private oldValX;
  horizontalScroll: HTMLElement;
  private verticalScroll;
  private header;
  private footer;
  /**
   * Static functions to bind wheel change
   */
  private horizontalMouseWheel;
  private verticalMouseWheel;
  private horisontalResize;
  private scrollService;
  /**
   * Last mw event time for trigger scroll function below
   * If mousewheel function was ignored we still need to trigger render
   */
  private mouseWheelScroll;
  setScroll(e: RevoGrid.ViewPortScrollEvent): Promise<void>;
  /**
   * update on delta in case we don't know existing position or external change
   * @param e
   */
  changeScroll(e: RevoGrid.ViewPortScrollEvent): Promise<RevoGrid.ViewPortScrollEvent>;
  connectedCallback(): void;
  componentDidLoad(): void;
  /**
   * Check if scroll present or not per type
   * Trigger this method on inner content size change or on outer element size change
   * If inner content bigger then outer size then scroll is present and mousewheel binding required
   * @param type - dimension type 'rgRow/y' or 'rgCol/x'
   * @param size - outer content size
   * @param innerContentSize - inner content size
   */
  setScrollVisibility(type: RevoGrid.DimensionType, size: number, innerContentSize: number): void;
  disconnectedCallback(): void;
  componentDidRender(): Promise<void>;
  render(): any;
  /**
   * Extra layer for scroll event monitoring, where MouseWheel event is not passing
   * We need to trigger scroll event in case there is no mousewheel event
   */
  private onScroll;
  /** remember last mw event time */
  private latestScrollUpdate;
  /**
   * On vertical mousewheel event
   * @param type
   * @param delta
   * @param e
   */
  private onVerticalMouseWheel;
  /**
   * On horizontal mousewheel event
   * @param type
   * @param delta
   * @param e
   */
  private onHorizontalMouseWheel;
}
