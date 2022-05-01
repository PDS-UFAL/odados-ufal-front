import { VNode } from '../../stencil-public-runtime';
import { RevoGrid } from '../../interfaces';
declare type Props = {
  model: RevoGrid.ColumnDataSchemaModel;
  canDrag?: boolean;
  onDragStart?(e: MouseEvent): void;
};
declare const CellRenderer: ({ model, canDrag, onDragStart }: Props) => (string | VNode)[];
export default CellRenderer;
