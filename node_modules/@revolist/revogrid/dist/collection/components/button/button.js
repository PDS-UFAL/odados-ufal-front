import { h } from '@stencil/core';
export const RevoButton = (props, children) => {
  return (h("button", Object.assign({}, props, { class: Object.assign(Object.assign({}, (typeof props.class === 'object' ? props.class : props.class ? { [props.class]: true } : '')), { ['revo-button']: true }) }), children));
};
