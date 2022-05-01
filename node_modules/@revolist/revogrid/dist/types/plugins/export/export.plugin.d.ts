import { CSVFormat, Formatter } from './types';
import BasePlugin from '../basePlugin';
declare enum ExportTypes {
  csv = "csv"
}
export declare type ExportFormat = Partial<CSVFormat>;
export default class ExportFilePlugin extends BasePlugin {
  /** Exports string */
  exportString(options?: ExportFormat, t?: ExportTypes): Promise<string>;
  /** Exports Blob */
  exportBlob(options?: ExportFormat, t?: ExportTypes): Promise<Blob>;
  /** Export file */
  exportFile(options?: ExportFormat, t?: ExportTypes): Promise<void>;
  /** Blob object */
  getBlob(formatter: Formatter): Promise<Blob>;
  private beforeexport;
  private getData;
  private getColPerSource;
  private getGroupHeaders;
  private findGroupStartIndex;
  private getSource;
  private formatter;
}
export {};
