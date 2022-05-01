export const HEADER_SLOT = 'header';
export const FOOTER_SLOT = 'footer';
export const CONTENT_SLOT = 'content';
export const DATA_SLOT = 'data';
/** Receive last visible in viewport by required type */
export function getLastCell(data, rowType) {
  return {
    x: data.viewports[data.colType].store.get('realCount'),
    y: data.viewports[rowType].store.get('realCount'),
  };
}
