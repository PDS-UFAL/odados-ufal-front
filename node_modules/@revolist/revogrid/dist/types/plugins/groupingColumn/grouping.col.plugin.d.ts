import { RevoGrid } from '../../interfaces';
import { ColumnCollection } from '../../services/column.data.provider';
import { Group as StoreGroup } from '../../store/dataSource/data.store';
import BasePlugin from '../basePlugin';
interface Group extends StoreGroup {
  level: number;
}
export declare type ColumnGrouping = Record<RevoGrid.DimensionCols, Group[]>;
export default class GroupingColumnPlugin extends BasePlugin {
  static gatherGroup<T extends ColumnCollection>(res: T, colData: RevoGrid.ColumnGrouping, collection: T, level?: number): T;
  static isColGrouping(colData: RevoGrid.ColumnGrouping | RevoGrid.ColumnRegular): colData is RevoGrid.ColumnGrouping;
}
export {};
