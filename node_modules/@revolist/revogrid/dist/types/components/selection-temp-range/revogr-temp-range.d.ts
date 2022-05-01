import { Observable, RevoGrid, Selection } from '../../interfaces';
export declare class RevogrFocus {
  el: HTMLElement;
  /** Dynamic stores */
  selectionStore: Observable<Selection.SelectionStoreState>;
  dimensionRow: Observable<RevoGrid.DimensionSettingsState>;
  dimensionCol: Observable<RevoGrid.DimensionSettingsState>;
  private readonly onChange;
  private doChange;
  componentDidRender(): void;
  render(): any;
  private getRange;
}
