import { Selection } from '../../interfaces';
import Cell = Selection.Cell;
import RangeArea = Selection.RangeArea;
export declare function isHiddenStore(pos: number): boolean;
export declare function nextCell(cell: Cell, lastCell: Cell): Partial<Cell> | null;
export declare function cropCellToMax(cell: Cell, lastCell: Cell): Cell;
export declare function getRange(start?: Cell, end?: Cell): RangeArea | null;
export declare function isRangeSingleCell(a: RangeArea): boolean;
