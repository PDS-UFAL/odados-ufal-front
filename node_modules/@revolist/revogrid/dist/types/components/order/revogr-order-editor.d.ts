import { EventEmitter } from '../../stencil-public-runtime';
import { Observable, RevoGrid, Selection } from '../../interfaces';
import { DataSourceState } from '../../store/dataSource/data.store';
export declare class OrderEditor {
  private rowOrderService;
  private moveFunc;
  private rowMoveFunc;
  parent: HTMLElement;
  dimensionRow: Observable<RevoGrid.DimensionSettingsState>;
  dimensionCol: Observable<RevoGrid.DimensionSettingsState>;
  /** Static stores, not expected to change during component lifetime */
  dataStore: Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>;
  /** Row drag started */
  internalRowDragStart: EventEmitter<{
    cell: Selection.Cell;
    text: string;
    pos: RevoGrid.PositionItem;
    event: MouseEvent;
  }>;
  /** Row drag ended */
  internalRowDragEnd: EventEmitter;
  /** Row move */
  internalRowDrag: EventEmitter<RevoGrid.PositionItem>;
  /** Row mouse move */
  internalRowMouseMove: EventEmitter<Selection.Cell>;
  /** Row dragged, new range ready to be applied */
  initialRowDropped: EventEmitter<{
    from: number;
    to: number;
  }>;
  onMouseOut(): void;
  /** Action finished inside of the document */
  onMouseUp(e: MouseEvent): void;
  dragStart(e: MouseEvent): Promise<void>;
  endOrder(e: MouseEvent): Promise<void>;
  clearOrder(): Promise<void>;
  move({ x, y }: {
    x: number;
    y: number;
  }): void;
  connectedCallback(): void;
  private onPositionChanged;
  private getData;
}
