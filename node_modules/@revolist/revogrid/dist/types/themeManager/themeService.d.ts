import { ThemeSpace } from '../interfaces';
export declare const DEFAULT_THEME = "default";
export declare const allowedThemes: ThemeSpace.Theme[];
export default class ThemeService {
  private currentTheme;
  private customRowSize;
  get theme(): ThemeSpace.ThemePackage;
  get rowSize(): number;
  set rowSize(size: number);
  constructor(cfg: ThemeSpace.ThemeConfig);
  register(theme: ThemeSpace.Theme): void;
  static getTheme(theme: string): ThemeSpace.Theme;
}
