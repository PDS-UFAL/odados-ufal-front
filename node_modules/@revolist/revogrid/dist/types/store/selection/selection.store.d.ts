import { Observable, Selection } from '../../interfaces';
declare type StoreState = Selection.SelectionStoreState;
export declare class SelectionStore {
  readonly store: Observable<Selection.SelectionStoreState>;
  private unsubscribe;
  constructor();
  onChange<Key extends keyof StoreState>(propName: Key, cb: (newValue: StoreState[Key]) => void): void;
  clearFocus(): void;
  setFocus(focus: Selection.Cell, end: Selection.Cell): void;
  setTempArea(range: Selection.TempRange | null): void;
  clearTemp(): void;
  /** Can be applied from selection change or from simple keyboard change clicks */
  setRangeArea(range: Selection.RangeArea): void;
  setRange(start: Selection.Cell, end: Selection.Cell): void;
  setLastCell(lastCell: Selection.Cell): void;
  setEdit(val: string | boolean): void;
  dispose(): void;
}
export {};
