import { RevoGrid } from '../../interfaces';
export declare type ExpandedOptions = {
  prevExpanded?: Record<string, boolean>;
  expandedAll?: boolean;
};
/**
 * Gather data for grouping
 * @param array - flat data array
 * @param mapFunc - mapping function for stringify
 * @param expanded - potentially expanded items if present
 */
export declare function gatherGrouping<T>(array: T[], mapFunc: (v: T) => any, { prevExpanded, expandedAll }: ExpandedOptions): {
  sourceWithGroups: RevoGrid.DataType[];
  depth: number;
  trimmed: Record<number, boolean>;
  oldNewIndexMap: Record<number, number>;
  childrenByGroup: Record<string, any>;
};
export declare function getGroupingName(rgRow?: RevoGrid.DataType): any;
export declare function isGrouping(rgRow?: RevoGrid.DataType): boolean;
export declare function isGroupingColumn(column?: RevoGrid.ColumnRegular): boolean;
export declare function isArray<T>(data: any | T[]): data is T[];
export declare function measureEqualDepth<T>(groupA: T[], groupB: T[]): number;
export declare function getParsedGroup(id: string): any[];
export declare function isSameGroup(currentGroup: any[], currentModel: RevoGrid.DataType, nextModel: RevoGrid.DataType): boolean;
