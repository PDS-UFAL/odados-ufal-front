import { VNode } from '../../stencil-public-runtime';
import { JSXBase } from '../../stencil-public-runtime';
export interface RowProps extends JSXBase.HTMLAttributes {
  size: number;
  start: number;
  rowClass?: string;
  depth?: number;
}
export declare const PADDING_DEPTH = 10;
declare const RowRenderer: ({ rowClass, size, start, style, depth }: RowProps, cells: VNode[]) => any;
export default RowRenderer;
