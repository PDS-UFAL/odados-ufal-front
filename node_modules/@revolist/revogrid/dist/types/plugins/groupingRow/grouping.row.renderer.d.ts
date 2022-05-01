import { RowProps } from '../../components/data/rowRenderer';
import { RevoGrid } from '../../interfaces';
interface GroupRowPros extends RowProps {
  model: RevoGrid.DataType;
  hasExpand: boolean;
}
declare type Props = GroupRowPros & RevoGrid.PositionItem;
declare const GroupingRowRenderer: (props: Props) => any;
export default GroupingRowRenderer;
