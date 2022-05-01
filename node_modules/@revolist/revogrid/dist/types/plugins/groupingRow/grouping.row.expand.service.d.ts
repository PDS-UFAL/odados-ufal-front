import { RevoGrid } from '../../interfaces';
export declare function doCollapse(pIndex: number, source: RevoGrid.DataType[]): {
  trimmed: Record<number, boolean>;
};
/**
 *
 * @param pIndex - physical index
 * @param vIndex - virtual index, need to update item collection
 * @param source - data source
 * @param rowItemsIndexes - rgRow indexes
 */
export declare function doExpand(vIndex: number, source: RevoGrid.DataType[], rowItemsIndexes: number[]): {
  trimmed: Record<number, boolean>;
  items?: number[];
};
