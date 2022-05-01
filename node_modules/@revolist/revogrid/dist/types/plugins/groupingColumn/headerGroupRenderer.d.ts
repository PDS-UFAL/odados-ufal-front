import { VNode } from '../../stencil-public-runtime';
import { ResizeEvent } from '../../services/resizable.directive';
import { Group } from '../../store/dataSource/data.store';
declare type Props = {
  start: number;
  end: number;
  group: Group;
  canResize?: boolean;
  onResize?(e: ResizeEvent): void;
};
declare const GroupHeaderRenderer: (p: Props) => VNode[];
export default GroupHeaderRenderer;
