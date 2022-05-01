import { EventEmitter } from '../../stencil-public-runtime';
import { HTMLStencilElement } from '../../stencil-public-runtime';
import { Observable, RevoGrid, Selection } from '../../interfaces';
import { Groups } from '../../store/dataSource/data.store';
export declare class RevogrHeaderComponent {
  element: HTMLStencilElement;
  viewportCol: Observable<RevoGrid.ViewportState>;
  dimensionCol: Observable<RevoGrid.DimensionSettingsState>;
  selectionStore: Observable<Selection.SelectionStoreState>;
  parent: string;
  groups: Groups;
  groupingDepth: number;
  canResize: boolean;
  colData: RevoGrid.ColumnRegular[];
  columnFilter: boolean;
  initialHeaderClick: EventEmitter<RevoGrid.InitialHeaderClick>;
  headerresize: EventEmitter<RevoGrid.ViewSettingSizeProp>;
  headerdblClick: EventEmitter<RevoGrid.InitialHeaderClick>;
  private onResize;
  private onResizeGroup;
  render(): any[];
}
