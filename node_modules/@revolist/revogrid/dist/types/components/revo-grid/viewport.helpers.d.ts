/** Collect data for pinned columns in required @ViewportProps format */
import { RevoGrid, Selection } from '../../interfaces';
import { ViewportColumn } from './viewport.interfaces';
export declare const HEADER_SLOT = "header";
export declare const FOOTER_SLOT = "footer";
export declare const CONTENT_SLOT = "content";
export declare const DATA_SLOT = "data";
/** Receive last visible in viewport by required type */
export declare function getLastCell(data: ViewportColumn, rowType: RevoGrid.MultiDimensionType): Selection.Cell;
