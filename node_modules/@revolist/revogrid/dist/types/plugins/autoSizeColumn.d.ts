import BasePlugin from './basePlugin';
import ColumnDataProvider from '../services/column.data.provider';
import { DataProvider } from '../services/data.provider';
import DimensionProvider from '../services/dimension.provider';
export declare type AutoSizeColumnConfig = {
  mode?: ColumnAutoSizeMode;
  /**
   * autoSize for all columns
   * if allColumnes true all columns treated as autoSize, worse for performance
   * false by default
   */
  allColumns?: boolean;
  /**
   * assumption per characted size
   * by default defined as 8, can be changed in this config
   */
  letterBlockSize?: number;
  /** make size calculation exact
   * by default it based on assumption each character takes some space defined in letterBlockSize */
  preciseSize?: boolean;
};
declare enum ColumnAutoSizeMode {
  headerClickAutosize = "headerClickAutoSize",
  autoSizeOnTextOverlap = "autoSizeOnTextOverlap",
  autoSizeAll = "autoSizeAll"
}
export default class AutoSizeColumn extends BasePlugin {
  private providers;
  private config?;
  private autoSizeColumns;
  private readonly letterBlockSize;
  /** for config option when @preciseSize enabled */
  private readonly precsizeCalculationArea;
  /** for edge case when no columns defined before data */
  private dataResolve;
  private dataReject;
  constructor(revogrid: HTMLRevoGridElement, providers: {
    dataProvider: DataProvider;
    dimensionProvider: DimensionProvider;
    columnProvider: ColumnDataProvider;
  }, config?: AutoSizeColumnConfig);
  private setSource;
  private getLength;
  private afteredit;
  private afterEditAll;
  private getColumnSize;
  private columnSet;
  private clearPromise;
  private isRangeEdit;
  private initiatePresizeElement;
  destroy(): void;
}
export {};
