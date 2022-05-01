import { EventEmitter } from '../../stencil-public-runtime';
import { RevoGrid } from '../../interfaces';
import { ElementScroll } from '../revo-grid/viewport.scrolling.service';
import { ViewportData } from '../revo-grid/viewport.interfaces';
export declare class RevogrRowHeaders {
  height: number;
  dataPorts: ViewportData[];
  headerProp: Record<string, any>;
  uiid: string;
  resize: boolean;
  rowHeaderColumn: RevoGrid.RowHeaders;
  scrollViewport: EventEmitter<RevoGrid.ViewPortScrollEvent>;
  elementToScroll: EventEmitter<ElementScroll>;
  render(): any;
}
