import { RevoGrid } from '../../interfaces';
import BasePlugin from '../basePlugin';
export declare type SortingOrder = Record<RevoGrid.ColumnProp, RevoGrid.Order>;
/**
 * lifecycle
 * 1) @event beforesorting - sorting just started, nothing happened yet
 * 2) @metod updateColumnSorting - column sorting icon applied to grid and column get updated, data still untiuched
 * 3) @event beforesortingapply - before we applied sorting data to data source, you can prevent data apply from here
 * 4) @event afterSortingApply - sorting applied, just finished event
 *
 * If you prevent event it'll not reach farther steps
 */
export default class SortingPlugin extends BasePlugin {
  protected revogrid: HTMLRevoGridElement;
  private sorting;
  private sortingFunc;
  get hasSorting(): boolean;
  constructor(revogrid: HTMLRevoGridElement);
  private headerclick;
  private setData;
  /**
   * Sorting apply, available for rgRow type only
   * @param sorting - per column sorting
   * @param data - this.stores['rgRow'].store.get('source')
   */
  private sort;
  private defaultCellCompare;
  private descCellCompare;
  private sortIndexByItems;
  private sortItems;
  private getNextOrder;
}
