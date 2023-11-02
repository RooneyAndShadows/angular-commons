import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private static readonly THEME_COOKIE_NAME = 'theme';
  private static readonly DEFAULT_THEME = 'light';
  public themeChanged: EventEmitter<{ old: string, new: string }> = new EventEmitter<{ old: string, new: string }>();

  constructor() {}

  public isDefault(): boolean {
    const token = localStorage.getItem(ThemeService.THEME_COOKIE_NAME);
    return token === null || token.length <= 0 || token === ThemeService.DEFAULT_THEME;
  }

  public getTheme(): string {
    if (!this.isDefault()) {
      return localStorage.getItem(ThemeService.THEME_COOKIE_NAME) as string;
    } else {
      return ThemeService.DEFAULT_THEME;
    }
  }

  public switchTheme(): void {
    const old = this.getTheme();
    const theme = this.isDefault() ? 'dark' : ThemeService.DEFAULT_THEME;
    localStorage.setItem(ThemeService.THEME_COOKIE_NAME, theme);
    this.themeChanged.emit({old: old, new: theme});
  }

  public removeSession(): void {
    localStorage.removeItem(ThemeService.THEME_COOKIE_NAME);
  }
}
