import { VNode } from '../../stencil-public-runtime';
import { DataSourceState } from '../../store/dataSource/data.store';
import { Edition, Observable, RevoGrid, Selection } from '../../interfaces';
import BeforeSaveDataDetails = Edition.BeforeSaveDataDetails;
import ColumnDataSchemaModel = RevoGrid.ColumnDataSchemaModel;
import DataType = RevoGrid.DataType;
export interface ColumnServiceI {
  columns: RevoGrid.ColumnRegular[];
  customRenderer(r: number, c: number, model: ColumnDataSchemaModel): VNode | string | void;
  isReadOnly(r: number, c: number): boolean;
  getCellData(r: number, c: number): string;
}
export declare type ColumnSource = Observable<DataSourceState<RevoGrid.ColumnRegular, RevoGrid.DimensionCols>>;
export declare type RowSource = Observable<DataSourceState<DataType, RevoGrid.DimensionRows>>;
export declare type ColumnStores = {
  [T in RevoGrid.DimensionCols]: ColumnSource;
};
export declare type RowStores = {
  [T in RevoGrid.DimensionRows]: RowSource;
};
export default class ColumnService implements ColumnServiceI {
  private dataStore;
  private source;
  private unsubscribe;
  get columns(): RevoGrid.ColumnRegular[];
  hasGrouping: boolean;
  constructor(dataStore: RowSource, source: ColumnSource);
  private checkGrouping;
  isReadOnly(r: number, c: number): boolean;
  static doMerge(existing: RevoGrid.CellProps, extra: RevoGrid.CellProps): RevoGrid.CellProps;
  mergeProperties(r: number, c: number, defaultProps: RevoGrid.CellProps): RevoGrid.CellProps;
  customRenderer(_r: number, c: number, model: ColumnDataSchemaModel): VNode | string | void;
  getRowClass(r: number, prop: string): string;
  getCellData(r: number, c: number): string;
  getSaveData(rowIndex: number, c: number, val?: string): BeforeSaveDataDetails;
  getCellEditor(_r: number, c: number, editors: Edition.Editors): Edition.EditorCtr | undefined;
  rowDataModel(rowIndex: number, c: number): ColumnDataSchemaModel;
  getRangeData(d: Selection.ChangedRange): RevoGrid.DataLookup;
  getTransformedDataToApply(start: Selection.Cell, data: RevoGrid.DataFormat[][]): {
    changed: RevoGrid.DataLookup;
    range: Selection.RangeArea;
  };
  applyRangeData(data: RevoGrid.DataLookup): void;
  getRangeStaticData(d: Selection.RangeArea, value: RevoGrid.DataFormat): RevoGrid.DataLookup;
  copyRangeArray(range: Selection.RangeArea, rangeProps: RevoGrid.ColumnProp[], store: Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>): RevoGrid.DataFormat[][];
  static getData(val?: any): string;
  destroy(): void;
}
