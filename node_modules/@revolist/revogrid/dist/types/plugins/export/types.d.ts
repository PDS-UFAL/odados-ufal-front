import { RevoGrid } from '../../interfaces';
export declare type ColSource = {
  headers: string[][];
  props: any[];
};
export declare type DataInput = {
  data: RevoGrid.DataType[];
} & ColSource;
export interface FormatterOptions {
  mime: string;
  encoding: string;
}
export interface Formatter {
  options: FormatterOptions;
  doExport(data: DataInput): string;
}
export interface CSVFormat extends FormatterOptions {
  fileKind: 'csv';
  bom: boolean;
  columnDelimiter: string;
  rowDelimiter: string;
  filename?: string;
}
