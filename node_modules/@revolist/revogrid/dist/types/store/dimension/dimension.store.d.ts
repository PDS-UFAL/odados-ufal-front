/**
 * Storing pre-calculated
 * Dimension information and sizes
 */
import { DimensionSize } from './dimension.helpers';
import { Observable, RevoGrid } from '../../interfaces';
export default class DimensionStore {
  readonly store: Observable<RevoGrid.DimensionSettingsState>;
  constructor();
  getCurrentState(): RevoGrid.DimensionSettingsState;
  setRealSize(count: number): void;
  setStore<T extends {
    [key: string]: any;
  }>(data: Partial<T>): void;
  drop(): void;
  setDimensionSize(sizes: RevoGrid.ViewSettingSizeProp): DimensionSize;
}
