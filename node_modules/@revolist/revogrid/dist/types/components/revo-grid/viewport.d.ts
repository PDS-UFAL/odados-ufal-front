import { VNode } from '../../stencil-public-runtime';
import { RevoGrid } from '../../interfaces';
import { DimensionStores } from '../../services/dimension.provider';
import { ViewportStores } from '../../services/viewport.provider';
import { OrdererService } from '../order/orderRenderer';
export interface ElementScroll {
  changeScroll?(e: RevoGrid.ViewPortScrollEvent): Promise<RevoGrid.ViewPortScrollEvent>;
  setScroll(e: RevoGrid.ViewPortScrollEvent): Promise<void>;
}
declare type Props = {
  viewports: ViewportStores;
  dimensions: DimensionStores;
  orderRef(e: OrdererService): void;
  registerElement(el: ElementScroll | null, key: string): void;
  onScroll(e: RevoGrid.ViewPortScrollEvent, key?: RevoGrid.DimensionColPin | string): void;
  nakedClick(e: MouseEvent): void;
};
export declare const RevoViewPort: ({ viewports, dimensions, orderRef, nakedClick, registerElement, onScroll }: Props, children: VNode[]) => any[];
export {};
