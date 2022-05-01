import eq from '../equal';
import lt from './lessThan';
const lsEq = function (value, extra) {
  return eq(value, extra) || lt(value, extra);
};
lsEq.extra = 'input';
export default lsEq;
