import ThemeCompact from './theme.compact';
import ThemeDefault from './theme.default';
import ThemeMaterial from './theme.material';
export const DEFAULT_THEME = 'default';
export const allowedThemes = [DEFAULT_THEME, 'material', 'compact', 'darkMaterial', 'darkCompact'];
export default class ThemeService {
  constructor(cfg) {
    this.customRowSize = 0;
    this.customRowSize = cfg.rowSize;
    this.register('default');
  }
  get theme() {
    return this.currentTheme;
  }
  get rowSize() {
    return this.customRowSize || this.currentTheme.defaultRowSize;
  }
  set rowSize(size) {
    this.customRowSize = size;
  }
  register(theme) {
    const parsedTheme = ThemeService.getTheme(theme);
    switch (parsedTheme) {
      case 'material':
      case 'darkMaterial':
        this.currentTheme = new ThemeMaterial();
        break;
      case 'compact':
      case 'darkCompact':
        this.currentTheme = new ThemeCompact();
        break;
      default:
        this.currentTheme = new ThemeDefault();
        break;
    }
  }
  static getTheme(theme) {
    if (allowedThemes.indexOf(theme) > -1) {
      return theme;
    }
    return DEFAULT_THEME;
  }
}
