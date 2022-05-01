import { VNode } from '../../stencil-public-runtime';
import { Edition, RevoGrid } from '../../interfaces';
import { ElementScroll } from './viewport';
import { ViewportProps } from './viewport.interfaces';
declare type Props = {
  editors: Edition.Editors;
  useClipboard: boolean;
  readonly: boolean;
  range: boolean;
  rowClass: string;
  resize: boolean;
  columns: ViewportProps[];
  columnFilter: boolean;
  onScroll(e: RevoGrid.ViewPortScrollEvent, key?: RevoGrid.DimensionColPin | string): void;
  onEdit(edit: Edition.BeforeEdit): void;
  registerElement(el: ElementScroll | null, key: string): void;
};
/**
 * All render based on sections
 * First we render vertical parts - pinned start, data, pinned end
 * Per each column we render data collections: headers, pinned top, center data, pinned bottom
 */
export declare const ViewPortSections: ({ resize, editors, rowClass, readonly, range, columns, useClipboard, columnFilter, registerElement, onEdit, onScroll }: Props) => VNode[];
export {};
