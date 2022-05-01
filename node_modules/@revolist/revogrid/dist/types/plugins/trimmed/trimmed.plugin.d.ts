import { Observable, PluginSubscribe } from '../../interfaces';
import { DataSourceState } from '../../store/dataSource/data.store';
export declare type TrimmedEntity = Record<number, boolean>;
export declare type Trimmed = Record<string, TrimmedEntity>;
/**
 * Hide items from main collection
 * But keep them in store
 */
export declare const trimmedPlugin: <T>(store: Observable<DataSourceState<T, any>>) => PluginSubscribe<DataSourceState<T, any>>;
export declare function gatherTrimmedItems(trimmedItems: Trimmed): TrimmedEntity;
