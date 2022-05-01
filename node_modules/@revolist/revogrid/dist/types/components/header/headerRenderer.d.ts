import { VNode } from '../../stencil-public-runtime';
import { RevoGrid, Selection } from '../../interfaces';
import { ResizeEvent } from '../../services/resizable.directive';
declare type Props = {
  column: RevoGrid.VirtualPositionItem;
  data?: RevoGrid.ColumnRegular;
  range?: Selection.RangeArea;
  canResize?: boolean;
  canFilter?: boolean;
  onResize?(e: ResizeEvent): void;
  onClick?(data: RevoGrid.InitialHeaderClick): void;
  onDoubleClick?(data: RevoGrid.InitialHeaderClick): void;
};
declare const HeaderRenderer: (p: Props) => VNode;
export default HeaderRenderer;
