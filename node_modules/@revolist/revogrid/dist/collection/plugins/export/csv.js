import { getGroupingName, isGrouping } from '../groupingRow/grouping.service';
const INITIAL = {
  mime: 'text/csv',
  fileKind: 'csv',
  // BOM signature
  bom: true,
  columnDelimiter: ',',
  rowDelimiter: '\r\n',
  encoding: '',
};
// The ASCII character code 13 is called a Carriage Return or CR.
const CARRIAGE_RETURN = String.fromCharCode(13);
// Chr(13) followed by a Chr(10) that compose a proper CRLF.
const LINE_FEED = String.fromCharCode(10);
const DOUBLE_QT = String.fromCharCode(34);
const NO_BREAK_SPACE = String.fromCharCode(0xfeff);
const escapeRegex = new RegExp('"', 'g');
export default class ExportCsv {
  constructor(options = {}) {
    this.options = Object.assign(Object.assign({}, INITIAL), options);
  }
  doExport({ data, headers, props }) {
    let result = this.options.bom ? NO_BREAK_SPACE : '';
    // any header
    if ((headers === null || headers === void 0 ? void 0 : headers.length) > 0) {
      headers.forEach(header => {
        // ignore empty
        if (!header.length) {
          return;
        }
        result += this.prepareHeader(header, this.options.columnDelimiter);
        result += this.options.rowDelimiter;
      });
    }
    data.forEach((rgRow, index) => {
      if (index > 0) {
        result += this.options.rowDelimiter;
      }
      // support grouping
      if (isGrouping(rgRow)) {
        result += this.parseCell(getGroupingName(rgRow), this.options.columnDelimiter);
        return;
      }
      result += props.map(p => this.parseCell(rgRow[p], this.options.columnDelimiter)).join(this.options.columnDelimiter);
    });
    return result;
  }
  prepareHeader(columnHeaders, columnDelimiter) {
    let result = '';
    const newColumnHeaders = columnHeaders.map(v => this.parseCell(v, columnDelimiter, true));
    result += newColumnHeaders.join(columnDelimiter);
    return result;
  }
  parseCell(value, columnDelimiter, force = false) {
    let escape = value;
    if (typeof value !== 'string') {
      escape = JSON.stringify(value);
    }
    const toEscape = [CARRIAGE_RETURN, DOUBLE_QT, LINE_FEED, columnDelimiter];
    if (typeof escape === 'undefined') {
      return '';
    }
    if (escape !== '' && (force || toEscape.some(i => escape.indexOf(i) >= 0))) {
      return `"${escape.replace(escapeRegex, '""')}"`;
    }
    return escape;
  }
}
