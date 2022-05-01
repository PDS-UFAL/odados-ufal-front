import { EventEmitter } from '../../stencil-public-runtime';
import { Edition, Observable, RevoGrid, Selection } from '../../interfaces';
import ColumnService from '../data/columnService';
import SelectionStoreService from '../../store/selection/selection.store.service';
import { DataSourceState } from '../../store/dataSource/data.store';
export declare class OverlaySelection {
  protected columnService: ColumnService;
  protected selectionStoreService: SelectionStoreService;
  private keyboardService;
  private autoFillService;
  private clipboardService;
  private orderEditor;
  element: HTMLElement;
  readonly: boolean;
  range: boolean;
  canDrag: boolean;
  useClipboard: boolean;
  /** Dynamic stores */
  selectionStore: Observable<Selection.SelectionStoreState>;
  dimensionRow: Observable<RevoGrid.DimensionSettingsState>;
  dimensionCol: Observable<RevoGrid.DimensionSettingsState>;
  /** Static stores, not expected to change during component lifetime */
  dataStore: Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>;
  colData: Observable<DataSourceState<RevoGrid.ColumnRegular, RevoGrid.DimensionCols>>;
  /** Last cell position */
  lastCell: Selection.Cell;
  /** Custom editors register */
  editors: Edition.Editors;
  internalCopy: EventEmitter;
  internalPaste: EventEmitter;
  internalCellEdit: EventEmitter<Edition.BeforeSaveDataDetails>;
  internalFocusCell: EventEmitter<Edition.BeforeSaveDataDetails>;
  setEdit: EventEmitter<Edition.BeforeEdit>;
  setRange: EventEmitter<Selection.RangeArea>;
  setTempRange: EventEmitter<Selection.TempRange | null>;
  focusCell: EventEmitter<Selection.FocusedCells>;
  /** Selection range changed */
  internalSelectionChanged: EventEmitter<Selection.ChangedRange>;
  /** Range data apply */
  internalRangeDataApply: EventEmitter<Edition.BeforeRangeSaveDataDetails>;
  onMouseMove(e: MouseEvent): void;
  /** Pointer left document, clear any active operation */
  onMouseOut(): void;
  /** Action finished inside of the document */
  onMouseUp(): void;
  /** Row drag started */
  onCellDrag(e: CustomEvent<MouseEvent>): void;
  /** Recived keyboard down from element */
  onKeyUp(e: KeyboardEvent): void;
  /** Recived keyboard down from element */
  onKeyDown(e: KeyboardEvent): void;
  /** Create selection store */
  selectionServiceSet(s: Observable<Selection.SelectionStoreState>): void;
  createAutoFillService(): void;
  columnServiceSet(): void;
  createClipboardService(): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
  private renderRange;
  private renderEditCell;
  render(): any;
  protected onElementMouseDown(e: MouseEvent): void;
  protected doEdit(val?: string, isCancel?: boolean): void;
  private closeEdit;
  private focusNext;
  protected clearCell(): void;
  /** Edit finished, close cell and save */
  protected onCellEdit(e: Edition.SaveDataDetails, clear?: boolean): void;
  private onRowDragStart;
  /** Check if edit possible */
  protected canEdit(): boolean;
  /** Collect data from element */
  protected getData(): {
    el: HTMLElement;
    rows: RevoGrid.DimensionSettingsState;
    cols: RevoGrid.DimensionSettingsState;
    lastCell: Selection.Cell;
  };
}
