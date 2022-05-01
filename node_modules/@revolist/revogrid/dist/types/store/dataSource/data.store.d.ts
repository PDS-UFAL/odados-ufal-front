import { Trimmed } from '../../plugins/trimmed/trimmed.plugin';
import { Observable, RevoGrid } from '../../interfaces';
import DataType = RevoGrid.DataType;
import ColumnRegular = RevoGrid.ColumnRegular;
import DimensionRows = RevoGrid.DimensionRows;
import DimensionCols = RevoGrid.DimensionCols;
export interface Group extends RevoGrid.ColumnProperties {
  name: string;
  children: RevoGrid.ColumnRegular[];
  ids: (string | number)[];
}
export declare type Groups = Record<any, any>;
export declare type GDataType = DataType | ColumnRegular;
export declare type GDimension = DimensionRows | DimensionCols;
export declare type DataSourceState<T extends GDataType, ST extends GDimension> = {
  items: number[];
  proxyItems: number[];
  source: T[];
  groupingDepth: number;
  groups: Groups;
  type: ST;
  trimmed: Trimmed;
};
export default class DataStore<T extends GDataType, ST extends GDimension> {
  private readonly dataStore;
  get store(): Observable<DataSourceState<T, ST>>;
  constructor(type: ST);
  /**
   * full data source update
   * @param source - data column/rgRow source
   * @param grouping - grouping information if present
   */
  updateData(source: T[], grouping?: {
    depth: number;
    groups?: Groups;
  }, silent?: boolean): void;
  addTrimmed(some: Partial<Trimmed>): void;
  setData(input: Partial<DataSourceState<T, ST>>): void;
  refresh(): void;
}
/**
 * get physical index by virtual
 * @param store - store to process
 */
export declare function getPhysical(store: Observable<DataSourceState<any, any>>, virtualIndex: number): number;
/**
 * get all visible items
 * @param store - store to process
 */
export declare function getVisibleSourceItem(store: Observable<DataSourceState<any, any>>): any[];
/**
 * get mapped item from source
 * @param store - store to process
 * @param virtualIndex - virtual index to process
 */
export declare function getSourceItem(store: Observable<DataSourceState<any, any>>, virtualIndex: number): any;
/**
 * set item to source
 * @param store  - store to process
 * @param modelByIndex - collection of rows with virtual indexes to setup
 */
export declare function setSourceByVirtualIndex<T>(store: Observable<DataSourceState<T, any>>, modelByIndex: Record<number, T>): void;
/**
 * set item to source
 * @param store  - store to process
 * @param modelByIndex - collection of rows with physical indexes to setup
 */
export declare function setSourceByPhysicalIndex<T>(store: Observable<DataSourceState<T, any>>, modelByIndex: Record<number, T>): void;
export declare function setItems<T>(store: Observable<DataSourceState<T, any>>, items: number[]): void;
export declare function getSourceItemVirtualIndexByProp(store: Observable<DataSourceState<any, any>>, prop: RevoGrid.ColumnProp): number;
