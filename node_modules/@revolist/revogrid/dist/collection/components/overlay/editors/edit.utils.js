import { EDIT_INPUT_WR } from '../../../utils/consts';
// is edit input
export function isEditInput(el) {
  return !!(el === null || el === void 0 ? void 0 : el.closest(`.${EDIT_INPUT_WR}`));
}
