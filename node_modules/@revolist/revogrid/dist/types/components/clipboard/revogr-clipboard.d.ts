import { EventEmitter } from '../../stencil-public-runtime';
import { RevoGrid } from '../../interfaces';
export declare class Clipboard {
  copyRegion: EventEmitter<DataTransfer>;
  pasteRegion: EventEmitter<string[][]>;
  onPaste(e: ClipboardEvent): void;
  copyStarted(e: ClipboardEvent): void;
  doCopy(e: DataTransfer, data?: RevoGrid.DataFormat[][]): Promise<void>;
  parserCopy(data: RevoGrid.DataFormat[][]): string;
  private textParse;
  private htmlParse;
  private getData;
}
