import { Edition, Selection } from '../interfaces';
import { SelectionStore } from '../store/selection/selection.store';
import Cell = Selection.Cell;
import EditCellStore = Edition.EditCellStore;
declare type StoreByDimension = Record<number, SelectionStore>;
declare type FocusedStore = {
  entity: SelectionStore;
  cell: Selection.Cell;
  position: Selection.Cell;
};
export declare const EMPTY_INDEX = -1;
export default class SelectionStoreConnector {
  private dirty;
  private readonly stores;
  readonly columnStores: StoreByDimension;
  readonly rowStores: {
    [y: number]: SelectionStore;
  };
  get focusedStore(): FocusedStore | null;
  get edit(): EditCellStore | undefined;
  get focused(): Cell | undefined;
  get selectedRange(): Selection.RangeArea | undefined;
  private readonly sections;
  registerSection(e?: Element): void;
  beforeUpdate(): void;
  registerColumn(x: number): SelectionStore;
  registerRow(y: number): SelectionStore;
  /**
   * Cross store proxy, based on multiple dimensions
   */
  register({ x, y }: Selection.Cell): SelectionStore;
  setEditByCell({ x, y }: Selection.Cell, editCell: Selection.Cell): void;
  focus(store: SelectionStore, { focus, end }: {
    focus: Cell;
    end: Cell;
  }): void;
  clearAll(): void;
  setEdit(val: string | boolean): void;
  private getXStores;
  private getYStores;
}
export {};
