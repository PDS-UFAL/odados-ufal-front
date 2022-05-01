/**
 * Store is responsible for visible
 * Viewport information for each dimension
 * Redraw items during scrolling
 */
import { DimensionDataViewport } from './viewport.helpers';
import { Observable, RevoGrid } from '../../interfaces';
export default class ViewportStore {
  readonly store: Observable<RevoGrid.ViewportState>;
  constructor();
  /** Render viewport based on coordinate, this is main method for draw */
  setViewPortCoordinate(position: number, dimension: DimensionDataViewport): void;
  /** Update viewport sizes */
  setViewPortDimension(sizes: RevoGrid.ViewSettingSizeProp): void;
  getItems(): Pick<RevoGrid.ViewportStateItems, 'items' | 'start' | 'end'>;
  setViewport(data: Partial<RevoGrid.ViewportState>): void;
  clear(): void;
}
