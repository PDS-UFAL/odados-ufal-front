import { VNode } from '../../stencil-public-runtime';
import { RevoGrid } from '../../interfaces';
import { Group } from '../../store/dataSource/data.store';
declare type Props = {
  visibleProps: {
    [prop: string]: number;
  };
  groups: Record<number, Group[]>;
  dimensionCol: Pick<RevoGrid.DimensionSettingsState, 'indexes' | 'originItemSize' | 'indexToItem'>;
  depth: number;
  canResize: boolean;
  onResize(changedX: number, startIndex: number, endIndex: number): void;
};
declare const ColumnGroupsRenderer: ({ depth, groups, visibleProps, dimensionCol, canResize, onResize }: Props) => VNode[];
export default ColumnGroupsRenderer;
