const contains = (value, extra) => {
  if (!value) {
    return false;
  }
  if (extra) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    return value.toLocaleLowerCase().indexOf(extra.toString().toLowerCase()) > -1;
  }
  return true;
};
export const notContains = (value, extra) => {
  return !contains(value, extra);
};
notContains.extra = 'input';
contains.extra = 'input';
export default contains;
