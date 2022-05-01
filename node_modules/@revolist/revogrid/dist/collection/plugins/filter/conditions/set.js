const set = (value) => !(value === '' || value === null || value === void 0);
export const notSet = (value) => !set(value);
export default set;
