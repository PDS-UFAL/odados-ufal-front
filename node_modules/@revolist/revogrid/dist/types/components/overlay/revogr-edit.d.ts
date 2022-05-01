import { EventEmitter } from '../../stencil-public-runtime';
import { Edition, RevoGrid } from '../../interfaces';
export declare class Edit {
  element: HTMLElement;
  editCell: Edition.EditCell;
  private currentEditor;
  column: RevoGrid.ColumnRegular | null;
  /** Custom editors register */
  editor: Edition.EditorCtr | null;
  cellEdit: EventEmitter<Edition.SaveDataDetails>;
  /** Close editor event */
  closeEdit: EventEmitter<boolean | undefined>;
  /** Callback triggered on cell editor save */
  onSave(val: Edition.SaveData, preventFocus?: boolean): void;
  componentWillRender(): void;
  componentDidRender(): void;
  disconnectedCallback(): void;
  render(): any;
}
