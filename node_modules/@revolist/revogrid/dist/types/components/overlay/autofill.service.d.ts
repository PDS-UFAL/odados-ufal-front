import { Observable, Selection, RevoGrid, Edition } from '../../interfaces';
import { EventData } from './selection.utils';
import SelectionStoreService from '../../store/selection/selection.store.service';
import ColumnService from '../data/columnService';
import { DataSourceState } from '../../store/dataSource/data.store';
declare type Config = {
  selectionStoreService: SelectionStoreService;
  dimensionRow: Observable<RevoGrid.DimensionSettingsState>;
  dimensionCol: Observable<RevoGrid.DimensionSettingsState>;
  columnService: ColumnService;
  dataStore: Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>;
  setTempRange(e: Selection.TempRange | null): Event;
  internalSelectionChanged(e: Selection.ChangedRange): Event;
  internalRangeDataApply(e: Edition.BeforeRangeSaveDataDetails): Event;
  setRange(e: Selection.RangeArea): Event;
  getData(): any;
};
declare enum AutoFillType {
  selection = "Selection",
  autoFill = "AutoFill"
}
export declare class AutoFillService {
  private sv;
  private autoFillType;
  private autoFillInitial;
  private autoFillStart;
  private autoFillLast;
  private onMouseMoveAutofill;
  constructor(sv: Config);
  /**
   * Render autofill box
   * @param range
   * @param selectionFocus
   */
  renderAutofill(range: Selection.RangeArea, selectionFocus: Selection.Cell): any;
  get isAutoFill(): boolean;
  /** Process mouse move events */
  selectionMouseMove(e: MouseEvent): void;
  private getFocus;
  /**
   * Autofill logic:
   * on mouse move apply based on previous direction (if present)
   */
  private doAutofillMouseMove;
  /**
   * Range selection started
   * Mode @param type:
   * Can be triggered from MouseDown selection on element
   * Or can be triggered on corner square drag
   */
  selectionStart(e: MouseEvent, data: EventData, type?: AutoFillType): void;
  /** Clear current range selection */
  clearAutoFillSelection(): void;
  /** Trigger range apply events and handle responses */
  onRangeApply(data: RevoGrid.DataLookup, range: Selection.RangeArea): void;
  /** Apply range and copy data during range application */
  private applyRangeWithData;
  /** Update range selection ony, no data change (mouse selection) */
  private applyRangeOnly;
}
export {};
