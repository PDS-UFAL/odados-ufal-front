import { Observable, PluginSubscribe } from '../../interfaces';
import { DataSourceState } from '../../store/dataSource/data.store';
declare type State = DataSourceState<any, any>;
/**
 * All items
 * Used as proxy for sorting
 * Keep order but do not modify final source
 */
export declare const proxyPlugin: (store: Observable<State>) => PluginSubscribe<State>;
export {};
