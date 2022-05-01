import { VNode } from '../../stencil-public-runtime';
import { RevoGrid, Selection } from '../../interfaces';
declare type Props = {
  ref: {
    (e: OrdererService): void;
  };
};
/**
 * Draw drag
 */
export declare class OrdererService {
  private parentY;
  el: HTMLElement;
  rgRow: HTMLElement;
  text: HTMLElement;
  draggable: HTMLElement;
  start(parent: HTMLElement, { pos, text, event }: {
    pos: RevoGrid.PositionItem;
    text: string;
    event: MouseEvent;
  }): void;
  end(): void;
  move(pos: RevoGrid.PositionItem): void;
  moveTip({ x, y }: Selection.Cell): void;
  private moveElement;
}
declare const OrderRenderer: ({ ref }: Props) => VNode[];
export default OrderRenderer;
