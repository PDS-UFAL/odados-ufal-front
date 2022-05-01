import { RevoGrid } from '../../interfaces';
import ColumnDataProvider from '../../services/column.data.provider';
import { DataProvider } from '../../services/data.provider';
import BasePlugin from '../basePlugin';
import { GroupingOptions } from './grouping.row.types';
export default class GroupingRowPlugin extends BasePlugin {
  protected revogrid: HTMLRevoGridElement;
  private providers;
  private options;
  get hasProps(): number;
  get store(): import("../../interfaces").Observable<import("../../store/dataSource/data.store").DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>;
  get rowItems(): number[];
  get trimmed(): import("../trimmed/trimmed.plugin").Trimmed;
  constructor(revogrid: HTMLRevoGridElement, providers: {
    dataProvider: DataProvider;
    columnProvider: ColumnDataProvider;
  });
  private onFocus;
  private onExpand;
  private getSource;
  private setColumnGrouping;
  private setColumns;
  private onDrag;
  private beforeTrimmedApply;
  private subscribe;
  /**
   * Starts global source update with group clearing and applying new one
   * Initiated when need to reapply grouping
   */
  private doSourceUpdate;
  /**
   * Apply grouping on data set
   * Clear grouping from source
   * If source came from other plugin
   */
  private onDataSet;
  setGrouping(options: GroupingOptions): void;
  clearGrouping(): void;
  private updateTrimmed;
}
