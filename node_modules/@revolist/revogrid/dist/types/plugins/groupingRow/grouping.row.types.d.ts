import { RevoGrid } from '../../interfaces';
export declare type GroupingOptions = {
  props?: RevoGrid.ColumnProp[];
  /** is expanded by default */
  expandedAll?: boolean;
};
export declare type BeforeSourceSetEvent = {
  type: RevoGrid.DimensionRows;
  source: RevoGrid.DataType[];
};
export declare type OnExpandEvent = {
  model: RevoGrid.DataType;
  virtualIndex: number;
};
export declare type SourceGather = {
  source: RevoGrid.DataType[];
  prevExpanded: Record<string, boolean>;
  oldNewIndexes?: Record<number, number>;
};
