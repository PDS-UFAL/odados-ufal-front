import { getPhysical, setItems } from '../../store/dataSource/data.store';
import { columnTypes } from '../../store/storeTypes';
import BasePlugin from '../basePlugin';
import { FILTER_TRIMMED_TYPE } from '../filter/filter.plugin';
import { GROUPING_ROW_TYPE, GROUP_EXPANDED, GROUP_EXPAND_EVENT, PSEUDO_GROUP_COLUMN, PSEUDO_GROUP_ITEM_VALUE } from './grouping.const';
import { doExpand, doCollapse } from './grouping.row.expand.service';
import { gatherGrouping, isGrouping, isGroupingColumn } from './grouping.service';
import { processDoubleConversionTrimmed, TRIMMED_GROUPING } from './grouping.trimmed.service';
export default class GroupingRowPlugin extends BasePlugin {
  constructor(revogrid, providers) {
    super(revogrid);
    this.revogrid = revogrid;
    this.providers = providers;
  }
  get hasProps() {
    var _a, _b, _c;
    return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.props) && ((_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.props) === null || _c === void 0 ? void 0 : _c.length);
  }
  get store() {
    return this.providers.dataProvider.stores[GROUPING_ROW_TYPE].store;
  }
  // proxy for items get
  get rowItems() {
    return this.store.get('items');
  }
  get trimmed() {
    return this.store.get('trimmed');
  }
  // befoce cell focus
  onFocus(e) {
    if (isGrouping(e.detail.model)) {
      e.preventDefault();
    }
  }
  // expand event triggered
  onExpand({ virtualIndex }) {
    const { source } = this.getSource();
    let newTrimmed = this.trimmed[TRIMMED_GROUPING];
    let i = getPhysical(this.store, virtualIndex);
    const model = source[i];
    const prevExpanded = model[GROUP_EXPANDED];
    if (!prevExpanded) {
      const { trimmed, items } = doExpand(virtualIndex, source, this.rowItems);
      newTrimmed = Object.assign(Object.assign({}, newTrimmed), trimmed);
      if (items) {
        setItems(this.store, items);
      }
    }
    else {
      const { trimmed } = doCollapse(i, source);
      newTrimmed = Object.assign(Object.assign({}, newTrimmed), trimmed);
      this.revogrid.clearFocus();
    }
    this.store.set('source', source);
    this.revogrid.addTrimmed(newTrimmed, TRIMMED_GROUPING);
  }
  // get source based on proxy item collection to preserve rgRow order
  getSource(withoutGrouping = false) {
    const source = this.store.get('source');
    const items = this.store.get('proxyItems');
    let index = 0;
    // order important here, expected parent is first, then others
    return items.reduce((result, i) => {
      const model = source[i];
      if (!withoutGrouping) {
        result.source.push(model);
        return result;
      }
      // grouping filter
      if (!isGrouping(model)) {
        result.source.push(model);
        result.oldNewIndexes[i] = index;
        index++;
      }
      else {
        if (model[GROUP_EXPANDED]) {
          result.prevExpanded[model[PSEUDO_GROUP_ITEM_VALUE]] = true;
        }
      }
      return result;
    }, {
      source: [],
      prevExpanded: {},
      oldNewIndexes: {},
    });
  }
  setColumnGrouping(cols) {
    // if 0 column as holder
    if (cols === null || cols === void 0 ? void 0 : cols.length) {
      cols[0][PSEUDO_GROUP_COLUMN] = true;
      return true;
    }
    return false;
  }
  setColumns({ columns }) {
    for (let type of columnTypes) {
      if (this.setColumnGrouping(columns[type])) {
        break;
      }
    }
  }
  // evaluate drag between groups
  onDrag(e) {
    const { from, to } = e.detail;
    const isDown = to - from >= 0;
    const { source } = this.getSource();
    const items = this.rowItems;
    let i = isDown ? from : to;
    const end = isDown ? to : from;
    for (; i < end; i++) {
      const model = source[items[i]];
      const isGroup = isGrouping(model);
      if (isGroup) {
        e.preventDefault();
        return;
      }
    }
  }
  beforeTrimmedApply(trimmed, type) {
    /** Before filter apply remove grouping filtering */
    if (type === FILTER_TRIMMED_TYPE) {
      const source = this.store.get('source');
      for (let index in trimmed) {
        if (trimmed[index] && isGrouping(source[index])) {
          trimmed[index] = false;
        }
      }
    }
  }
  // subscribe to grid events to process them accordingly
  subscribe() {
    /** if grouping present and new data source arrived */
    this.addEventListener('beforesourceset', ({ detail }) => this.onDataSet(detail));
    this.addEventListener('beforecolumnsset', ({ detail }) => this.setColumns(detail));
    /**
     * filter applied need to clear grouping and apply again
     * based on new results can be new grouping
     */
    this.addEventListener('beforetrimmed', ({ detail: { trimmed, trimmedType } }) => this.beforeTrimmedApply(trimmed, trimmedType));
    /**
     * sorting applied need to clear grouping and apply again
     * based on new results whole grouping order will changed
     */
    this.addEventListener('afterSortingApply', () => this.doSourceUpdate());
    /**
     * Apply logic for focus inside of grouping
     * We can't focus on grouping rows, navigation only inside of groups for now
     */
    this.addEventListener('beforecellfocus', e => this.onFocus(e));
    /**
     * Prevent rgRow drag outside the group
     */
    this.addEventListener('roworderchanged', e => this.onDrag(e));
    /**
     * When grouping expand icon was clicked
     */
    this.addEventListener(GROUP_EXPAND_EVENT, ({ detail }) => this.onExpand(detail));
  }
  /**
   * Starts global source update with group clearing and applying new one
   * Initiated when need to reapply grouping
   */
  doSourceUpdate(options) {
    if (!this.hasProps) {
      return;
    }
    /**
     * Get source without grouping
     * @param newOldIndexMap - provides us mapping with new indexes vs old indexes, we would use it for trimmed mapping
     */
    const { source, prevExpanded, oldNewIndexes } = this.getSource(true);
    /**
     * Group again
     * @param oldNewIndexMap - provides us mapping with new indexes vs old indexes
     */
    const { sourceWithGroups, depth, trimmed, oldNewIndexMap, childrenByGroup } = gatherGrouping(source, 
    // filter
    item => { var _a; return (_a = this.options) === null || _a === void 0 ? void 0 : _a.props.map(key => item[key]); }, Object.assign({ prevExpanded }, options));
    // setup source
    this.providers.dataProvider.setData(sourceWithGroups, GROUPING_ROW_TYPE, { depth }, true);
    this.updateTrimmed(trimmed, childrenByGroup, oldNewIndexes, oldNewIndexMap);
  }
  /**
   * Apply grouping on data set
   * Clear grouping from source
   * If source came from other plugin
   */
  onDataSet(data) {
    if (!this.hasProps || !(data === null || data === void 0 ? void 0 : data.source) || !data.source.length) {
      return;
    }
    const source = data.source.filter(s => !isGrouping(s));
    const expanded = this.revogrid.grouping || {};
    const { sourceWithGroups, depth, trimmed, oldNewIndexMap, childrenByGroup } = gatherGrouping(source, 
    // filter
    item => { var _a; return (_a = this.options) === null || _a === void 0 ? void 0 : _a.props.map(key => item[key]); }, Object.assign({}, (expanded || {})));
    data.source = sourceWithGroups;
    this.providers.dataProvider.setGrouping({ depth });
    this.updateTrimmed(trimmed, childrenByGroup, oldNewIndexMap);
  }
  // apply grouping
  setGrouping(options) {
    // unsubscribe from all events when group applied
    this.clearSubscriptions();
    this.options = options;
    // clear props, no grouping exists
    if (!options.props || !Object.keys(options.props).length) {
      this.clearGrouping();
      return;
    }
    // props exist and source inited
    const { source } = this.getSource();
    if (source.length) {
      this.doSourceUpdate(Object.assign({}, options));
    }
    // props exist and columns inited
    for (let t of columnTypes) {
      if (this.setColumnGrouping(this.providers.columnProvider.getColumns(t))) {
        this.providers.columnProvider.refreshByType(t);
        break;
      }
    }
    // if has any grouping subscribe to events again
    this.subscribe();
  }
  // clear grouping
  clearGrouping() {
    // clear columns
    columnTypes.forEach(t => {
      const cols = this.providers.columnProvider.getColumns(t);
      let deleted = false;
      cols.forEach(c => {
        if (isGroupingColumn(c)) {
          delete c[PSEUDO_GROUP_COLUMN];
          deleted = true;
        }
      });
      // if column store had grouping clear and refresh
      if (deleted) {
        this.providers.columnProvider.refreshByType(t);
      }
    });
    // clear rows
    const { source, oldNewIndexes } = this.getSource(true);
    this.providers.dataProvider.setData(source, GROUPING_ROW_TYPE, undefined, true);
    this.updateTrimmed(undefined, undefined, oldNewIndexes);
  }
  updateTrimmed(trimmedGroup = {}, _childrenByGroup = {}, firstLevelMap, secondLevelMap) {
    // map previously trimmed data
    const trimemedOptionsToUpgrade = processDoubleConversionTrimmed(this.trimmed, firstLevelMap, secondLevelMap);
    for (let type in trimemedOptionsToUpgrade) {
      this.revogrid.addTrimmed(trimemedOptionsToUpgrade[type], type);
    }
    // const emptyGroups = this.filterOutEmptyGroups(trimemedOptionsToUpgrade, childrenByGroup);
    // setup trimmed data for grouping
    this.revogrid.addTrimmed(Object.assign({}, trimmedGroup), TRIMMED_GROUPING);
  }
}
