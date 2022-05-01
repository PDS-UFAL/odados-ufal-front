import { RevoGrid } from '../../interfaces';
export declare type DimensionPosition = Pick<RevoGrid.DimensionSettingsState, 'indexes' | 'positionIndexes' | 'originItemSize' | 'positionIndexToItem'>;
declare type DimensionIndexInput = Pick<RevoGrid.DimensionSettingsState, 'indexes' | 'originItemSize' | 'indexToItem'>;
export declare type DimensionSize = Pick<RevoGrid.DimensionSettingsState, 'indexes' | 'positionIndexes' | 'positionIndexToItem' | 'indexToItem' | 'realSize' | 'sizes'>;
/**
 * Pre-calculation
 * Dimension sizes for each cell
 */
export declare function calculateDimensionData(state: RevoGrid.DimensionSettingsState, newSizes: RevoGrid.ViewSettingSizeProp): DimensionSize;
export declare function getItemByPosition({ indexes, positionIndexes, originItemSize, positionIndexToItem }: DimensionPosition, pos: number): RevoGrid.PositionItem;
export declare function getItemByIndex(dimension: DimensionIndexInput, index: number): RevoGrid.PositionItem;
export {};
