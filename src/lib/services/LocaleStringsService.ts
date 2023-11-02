import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DateAdapter} from '@angular/material/core';

@Injectable()
export class LocaleStringsService {
  constructor(private locales: TranslateService, private dateAdapter: DateAdapter<any>) {
    locales.addLangs(['en']);
    locales.setDefaultLang('en');
    dateAdapter.setLocale('en');
  }

  public addSupportedLocales(array: string[]): void {
    this.locales.addLangs(array);
  }

  public setDefaultLocale(locale: string): void {
    this.locales.setDefaultLang(locale);
  }

  public changeLanguage(locale: string): void {
    this.locales.use(locale);
    this.dateAdapter.setLocale(locale);
  }

  public currentLanguage(): string {
    return this.locales.currentLang;
  }

  public getString(name: string | string[]): string | any {
    return this.locales.instant(name);
  }

  public getStringOrDefault(name: string, def: string): string {
    const res = this.locales.instant(name);
    if (res == name) return def;
    return res;
  }
}
