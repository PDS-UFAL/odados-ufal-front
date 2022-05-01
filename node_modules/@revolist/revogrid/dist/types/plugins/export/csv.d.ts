import { CSVFormat, DataInput, Formatter } from './types';
export declare type CSVFormatter = (options: Partial<CSVFormat>, data: DataInput) => string;
export default class ExportCsv implements Formatter {
  readonly options: Readonly<CSVFormat>;
  constructor(options?: Partial<CSVFormat>);
  doExport({ data, headers, props }: DataInput): string;
  private prepareHeader;
  private parseCell;
}
