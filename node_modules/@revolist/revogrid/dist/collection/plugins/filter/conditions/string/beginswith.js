const beginsWith = (value, extra) => {
  if (!value) {
    return false;
  }
  if (!extra) {
    return true;
  }
  if (typeof value !== 'string') {
    value = JSON.stringify(value);
  }
  if (typeof extra !== 'string') {
    extra = JSON.stringify(extra);
  }
  return value.toLocaleLowerCase().indexOf(extra.toLocaleLowerCase()) === 0;
};
beginsWith.extra = 'input';
export default beginsWith;
