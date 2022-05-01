const lt = function (value, extra) {
  let conditionValue;
  if (typeof value === 'number') {
    conditionValue = parseFloat(extra === null || extra === void 0 ? void 0 : extra.toString());
    return value < conditionValue;
  }
  else {
    return false;
  }
};
lt.extra = 'input';
export default lt;
