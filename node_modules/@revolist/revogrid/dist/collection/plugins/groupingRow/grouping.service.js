import { GROUP_DEPTH, GROUP_EXPANDED, PSEUDO_GROUP_COLUMN, PSEUDO_GROUP_ITEM, PSEUDO_GROUP_ITEM_ID, PSEUDO_GROUP_ITEM_VALUE } from './grouping.const';
/**
 * Do actual grouping
 * @param array - items to group
 * @param f - function responsible for grouping, returns property to group by
 */
function groupBy(array, f) {
  const groupsOrder = [];
  const itemsByGroup = {};
  array.forEach((item, i) => {
    // get grouping values
    const groupKeys = JSON.stringify(f(item));
    // new group identification
    if (!itemsByGroup[groupKeys]) {
      itemsByGroup[groupKeys] = new Map();
      // create group parents
      groupsOrder.push({
        children: itemsByGroup[groupKeys],
        id: groupKeys,
      });
    }
    // save to group with previous index
    itemsByGroup[groupKeys].set(i, item);
  });
  return groupsOrder;
}
/**
 * Gather data for grouping
 * @param array - flat data array
 * @param mapFunc - mapping function for stringify
 * @param expanded - potentially expanded items if present
 */
export function gatherGrouping(array, mapFunc, { prevExpanded, expandedAll }) {
  // build groups
  const groupsOrder = groupBy(array, mapFunc);
  const itemsMirror = []; // grouped source
  const pseudoGroupTest = {}; // check if group header exists
  // item index in source
  let itemIndex = 0;
  // to save max group depth
  let groupingDepth = 0;
  // collapse all groups in the beginning
  const trimmed = {};
  // index mapping
  const oldNewIndexMap = {};
  // go through groups
  groupsOrder.forEach(group => {
    const parseGroup = getParsedGroup(group.id);
    // extra precaution and type safe guard
    if (!parseGroup) {
      return;
    }
    let depth = 0;
    let skipTrim = !!expandedAll;
    let isExpanded = skipTrim;
    const children = [];
    // add group headers
    parseGroup.reduce((prevVal, groupValue) => {
      prevVal.push(groupValue);
      const newVal = prevVal.join(',');
      // if header not added, add new header
      if (!pseudoGroupTest[newVal]) {
        isExpanded = expandedAll || (prevExpanded && prevExpanded[newVal]);
        itemsMirror.push(getPseudoGroup(groupValue, newVal, depth, group.id, isExpanded));
        // if not first level auto collapse
        if (depth && !isExpanded && !skipTrim) {
          // check if parent expanded, expand this layer too
          const parent = prevVal.slice(0, prevVal.length - 1);
          if (!(prevExpanded && parent.length && prevExpanded[parent.join(',')])) {
            trimmed[itemIndex] = true;
          }
        }
        itemIndex++;
        pseudoGroupTest[newVal] = children;
      }
      // calculate depth
      depth++;
      groupingDepth = depth;
      return prevVal;
    }, []);
    // add regular items
    group.children.forEach((item, oldIndex) => {
      // hide items if group colapsed
      if (!isExpanded && !skipTrim) {
        // collapse rgRow
        trimmed[itemIndex] = true;
      }
      // add items to new source
      itemsMirror.push(item);
      oldNewIndexMap[oldIndex] = itemIndex;
      children.push(itemIndex);
      itemIndex++;
    });
  });
  return {
    // updates source mirror
    sourceWithGroups: itemsMirror,
    // largest depth for grouping
    depth: groupingDepth,
    // used for expand/collapse grouping values
    trimmed,
    // used for mapping old values to new
    oldNewIndexMap,
    // used to get child items in group
    childrenByGroup: pseudoGroupTest,
  };
}
function getPseudoGroup(groupValue, value, depth, id, isExpanded = false) {
  return {
    [PSEUDO_GROUP_ITEM]: groupValue,
    [GROUP_DEPTH]: depth,
    [PSEUDO_GROUP_ITEM_ID]: id,
    [PSEUDO_GROUP_ITEM_VALUE]: value,
    [GROUP_EXPANDED]: isExpanded,
  };
}
export function getGroupingName(rgRow) {
  return rgRow && rgRow[PSEUDO_GROUP_ITEM];
}
export function isGrouping(rgRow) {
  return rgRow && typeof rgRow[PSEUDO_GROUP_ITEM] !== 'undefined';
}
export function isGroupingColumn(column) {
  return column && typeof column[PSEUDO_GROUP_COLUMN] !== 'undefined';
}
export function isArray(data) {
  return typeof data.push !== 'undefined';
}
export function measureEqualDepth(groupA, groupB) {
  const ln = groupA.length;
  let i = 0;
  for (; i < ln; i++) {
    if (groupA[i] !== groupB[i]) {
      return i;
    }
  }
  return i;
}
export function getParsedGroup(id) {
  const parseGroup = JSON.parse(id);
  // extra precaution and type safe guard
  if (!isArray(parseGroup)) {
    return null;
  }
  return parseGroup;
}
// check if items is child of current clicked group
export function isSameGroup(currentGroup, currentModel, nextModel) {
  const nextGroup = getParsedGroup(nextModel[PSEUDO_GROUP_ITEM_ID]);
  if (!nextGroup) {
    return false;
  }
  const depth = measureEqualDepth(currentGroup, nextGroup);
  return currentModel[GROUP_DEPTH] < depth;
}
