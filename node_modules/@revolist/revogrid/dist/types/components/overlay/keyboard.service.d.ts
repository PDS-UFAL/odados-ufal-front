import { Observable, Selection } from '../../interfaces';
import SelectionStoreService from '../../store/selection/selection.store.service';
import { EventData } from './selection.utils';
declare type Config = {
  selectionStoreService: SelectionStoreService;
  selectionStore: Observable<Selection.SelectionStoreState>;
  doEdit(val?: any, isCancel?: boolean): void;
  clearCell(): void;
  getData(): any;
  internalPaste(): void;
};
export declare class KeyboardService {
  private sv;
  private ctrlDown;
  constructor(sv: Config);
  keyDown(e: KeyboardEvent, canRange: boolean): Promise<void>;
  keyChangeSelection(e: KeyboardEvent, canRange: boolean): Promise<boolean>;
  keyPositionChange(changes: Partial<Selection.Cell>, eData: EventData, range?: Selection.RangeArea, focus?: Selection.Cell, isMulti?: boolean): boolean;
  keyUp(e: KeyboardEvent): void;
  isCopy(e: KeyboardEvent): boolean;
  isPaste(e: KeyboardEvent): boolean;
  /** Monitor key direction changes */
  changeDirectionKey(e: KeyboardEvent, canRange: boolean): {
    changes: Partial<Selection.Cell>;
    isMulti?: boolean;
  } | void;
}
export {};
