import eq from '../equal';
import gt from './greaterThan';
const gtThanEq = function (value, extra) {
  return eq(value, extra) || gt(value, extra);
};
gtThanEq.extra = 'input';
export default gtThanEq;
