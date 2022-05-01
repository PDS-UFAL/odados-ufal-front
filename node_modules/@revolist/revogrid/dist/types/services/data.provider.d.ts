import DataStore, { Groups } from '../store/dataSource/data.store';
import DimensionProvider from './dimension.provider';
import { RevoGrid, Edition } from '../interfaces';
import { Trimmed } from '../plugins/trimmed/trimmed.plugin';
import DimensionRows = RevoGrid.DimensionRows;
import DataType = RevoGrid.DataType;
export declare type RowDataSources = {
  [T in DimensionRows]: DataStore<DataType, DimensionRows>;
};
export declare class DataProvider {
  private dimensionProvider;
  readonly stores: RowDataSources;
  constructor(dimensionProvider: DimensionProvider);
  setData(data: DataType[], type?: DimensionRows, grouping?: {
    depth: number;
    groups?: Groups;
  }, silent?: boolean): DataType[];
  getModel(virtualIndex: number, type?: DimensionRows): any;
  setCellData({ type, rowIndex, prop, val }: Edition.BeforeSaveDataDetails): void;
  refresh(type?: DimensionRows | 'all'): void;
  refreshItems(type?: DimensionRows): void;
  setGrouping({ depth }: {
    depth: number;
  }, type?: DimensionRows): void;
  setTrimmed(trimmed: Partial<Trimmed>, type?: DimensionRows): void;
}
