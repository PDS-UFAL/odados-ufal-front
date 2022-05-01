import { RevoGrid } from '../../interfaces';
export declare const FILTER_BUTTON_CLASS = "rv-filter";
export declare const FILTER_BUTTON_ACTIVE = "active";
export declare const FILTER_PROP = "hasFilter";
export declare const AND_OR_BUTTON = "and-or-button";
export declare const TRASH_BUTTON = "trash-button";
declare type Props = {
  column: RevoGrid.ColumnRegular;
};
export declare const FilterButton: ({ column }: Props) => any;
export declare const TrashButton: () => any;
export declare const AndOrButton: ({ isAnd }: any) => any;
export declare function isFilterBtn(e: HTMLElement): true | Element;
export {};
