import { VNode, EventEmitter } from '../../stencil-public-runtime';
import { HTMLStencilElement } from '../../stencil-public-runtime';
import { ColumnSource, RowSource } from './columnService';
import { Observable, RevoGrid, Selection } from '../../interfaces';
export declare class RevogrData {
  private columnService;
  element: HTMLStencilElement;
  readonly: boolean;
  range: boolean;
  canDrag: boolean;
  rowClass: string;
  rowSelectionStore: Observable<Selection.SelectionStoreState>;
  viewportRow: Observable<RevoGrid.ViewportState>;
  viewportCol: Observable<RevoGrid.ViewportState>;
  dimensionRow: Observable<RevoGrid.DimensionSettingsState>;
  /** Static stores, not expected to change during component lifetime */
  colData: ColumnSource;
  dataStore: RowSource;
  dragStartCell: EventEmitter<MouseEvent>;
  onStoreChange(): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): "" | VNode[];
  private getCellRenderer;
}
