export const rowTypes = ['rowPinStart', 'rgRow', 'rowPinEnd'];
export const columnTypes = ['colPinStart', 'rgCol', 'colPinEnd'];
export function isRowType(type) {
  return rowTypes.indexOf(type) > -1;
}
