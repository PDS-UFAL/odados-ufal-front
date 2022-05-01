import { h } from '@stencil/core';
export const FILTER_BUTTON_CLASS = 'rv-filter';
export const FILTER_BUTTON_ACTIVE = 'active';
export const SortingSign = ({ column }) => {
  return h("i", { class: column.order });
};
