import { VNode } from '../../stencil-public-runtime';
import { RevoGrid } from '../../interfaces';
declare type Props = {
  data?: RevoGrid.ColumnRegular;
  props: RevoGrid.CellProps;
};
export declare const HeaderCellRenderer: ({ data, props }: Props, children: VNode[]) => VNode;
export {};
