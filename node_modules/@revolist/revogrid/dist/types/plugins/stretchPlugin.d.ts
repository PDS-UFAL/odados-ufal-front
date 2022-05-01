import { RevoPlugin } from '../interfaces';
import DimensionProvider, { ColumnItems } from '../services/dimension.provider';
import BasePlugin from './basePlugin';
export default class StretchColumn extends BasePlugin {
  private dimensionProvider;
  private stretchedColumn;
  private readonly scrollSize;
  constructor(revogrid: HTMLRevoGridElement, dimensionProvider: DimensionProvider);
  private setScroll;
  private activateChanges;
  private dropChanges;
  private apply;
  applyStretch(columns: ColumnItems): void;
}
export declare function isStretchPlugin(plugin: RevoPlugin.Plugin | StretchColumn): plugin is StretchColumn;
