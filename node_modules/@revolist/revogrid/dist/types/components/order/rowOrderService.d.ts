import { RevoGrid, Selection } from '../../interfaces';
declare type EventData = {
  el: HTMLElement;
  rows: RevoGrid.DimensionSettingsState;
  cols: RevoGrid.DimensionSettingsState;
};
interface Config {
  positionChanged(from: number, to: number): void;
}
export default class RowOrderService {
  private config;
  private currentCell;
  private previousRow;
  constructor(config: Config);
  /** Drag finished, calculate and apply changes */
  endOrder(e: MouseEvent, data: EventData): void;
  /** Drag started, reserve initial cell for farther use */
  startOrder(e: MouseEvent, data: EventData): Selection.Cell;
  move(y: number, data: EventData): RevoGrid.PositionItem | null;
  /** Drag stopped, probably cursor outside of document area */
  clear(): void;
  /** Calculate cell based on x, y position */
  getRow(y: number, { el, rows }: EventData): RevoGrid.PositionItem;
  /** Calculate cell based on x, y position */
  getCell({ x, y }: Selection.Cell, { el, rows, cols }: EventData): Selection.Cell;
}
export {};
