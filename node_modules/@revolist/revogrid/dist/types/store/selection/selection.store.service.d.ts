import { Edition, Observable, Selection } from '../../interfaces';
import Cell = Selection.Cell;
import Range = Selection.RangeArea;
interface Config {
  changeRange(range: Range): boolean;
  focus(focus: Cell, end: Cell): boolean;
}
export default class SelectionStoreService {
  store: Observable<Selection.SelectionStoreState>;
  private config;
  constructor(store: Observable<Selection.SelectionStoreState>, config: Config);
  get edited(): Edition.EditCellStore | null;
  get focused(): Cell | null;
  get ranged(): Range | null;
  changeRange(range: Range): boolean;
  focus(cell?: Cell, isMulti?: boolean): boolean;
}
export {};
