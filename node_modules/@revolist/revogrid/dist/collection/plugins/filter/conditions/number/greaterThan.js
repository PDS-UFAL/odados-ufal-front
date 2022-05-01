const gtThan = function (value, extra) {
  let conditionValue;
  if (typeof value === 'number') {
    conditionValue = parseFloat(extra === null || extra === void 0 ? void 0 : extra.toString());
    return value > conditionValue;
  }
  return false;
};
gtThan.extra = 'input';
export default gtThan;
