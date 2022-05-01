import SelectionStoreService from '../../store/selection/selection.store.service';
import { Observable, RevoGrid, Selection } from '../../interfaces';
import ColumnService from '../data/columnService';
import { DataSourceState } from '../../store/dataSource/data.store';
declare type Config = {
  selectionStoreService: SelectionStoreService;
  columnService: ColumnService;
  dataStore: Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>;
  onRangeApply(data: RevoGrid.DataLookup, range: Selection.RangeArea): void;
  internalCopy(): Event;
};
export declare class ClipboardService {
  private sv;
  private clipboard;
  constructor(sv: Config);
  private onCopy;
  renderClipboard(): any;
  private onPaste;
}
export {};
