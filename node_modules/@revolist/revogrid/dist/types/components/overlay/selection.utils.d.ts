import { Selection, RevoGrid } from '../../interfaces';
import Cell = Selection.Cell;
export declare type EventData = {
  el: HTMLElement;
  rows: RevoGrid.DimensionSettingsState;
  cols: RevoGrid.DimensionSettingsState;
  lastCell: Selection.Cell;
};
/** Calculate cell based on x, y position */
export declare function getCurrentCell({ x, y }: Cell, { el, rows, cols }: EventData): Cell;
export declare function getCoordinate(range: Selection.RangeArea, focus: Cell, changes: Partial<Cell>, isMulti?: boolean): {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
};
/** check if out of range */
export declare function isAfterLast({ x, y }: Cell, { lastCell }: EventData): boolean;
/** check if out of range */
export declare function isBeforeFirst({ x, y }: Cell): boolean;
/** Compare cells, only 1 coordinate difference is possible */
export declare function getDirectionCoordinate(initial: Cell, last: Cell): Partial<Cell> | null;
export declare function getLargestAxis(initial: Cell, last: Cell): Partial<Cell> | null;
export declare function getCell({ x, y, x1, y1 }: Selection.RangeArea, dimensionRow: RevoGrid.DimensionSettingsState, dimensionCol: RevoGrid.DimensionSettingsState): {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
};
export declare function getElStyle(range: Selection.RangeArea, dimensionRow: RevoGrid.DimensionSettingsState, dimensionCol: RevoGrid.DimensionSettingsState): Selection.RangeAreaCss;
