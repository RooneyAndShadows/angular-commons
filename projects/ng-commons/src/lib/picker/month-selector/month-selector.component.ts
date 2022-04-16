import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {formatDate, formatNumber} from '@angular/common';
import {LocaleStringsService} from '../../services/LocaleStringsService';
// @ts-ignore
import moment from 'moment';

@Component({
  selector: 'app-month-selector',
  templateUrl: './month-selector.component.html',
  styleUrls: ['./month-selector.component.scss']
})
export class MonthSelectorComponent  {
  public picked_year = false;
  public readonly MONTHS: string[] = [];

  constructor(
    public translate: LocaleStringsService,
    public dialogRef: MatDialogRef<MonthSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MonthSelectorData) {
    for (let i = 1; i <= 12; i++) {
      const date = moment('01.' + formatNumber(i, 'en', '2.0-0') + '.2021', 'DD.MM.YYYY')
      this.MONTHS.push(formatDate(date.toDate(), 'MMMM', this.translate.currentLanguage()))
    }
  }

  onClick(): void {
    this.dialogRef.close(this.data);
  }

  buildDateArray(): number[] {
    const years = [];
    const start = this.data.current_year - 5;
    const end = start + 10;
    for (let i = start; i <= end; i++) {
      years.push(i);
    }
    return years;
  }

  selectYear(year: number) {
    this.data.current_year = year;
    if (typeof this.data.allowedMonthsLazy !== 'undefined') {
      this.data.allowedMonthsLazy(year).subscribe(value => {
        this.data.allowedMonths = value;
        this.picked_year = true;
      });
    } else {
      this.picked_year = true;
    }
  }

  isAllowedMonth(month: number): boolean {
    return this.data.allowedMonths === undefined || this.data.allowedMonths.filter(value => value === month).length > 0;
  }
}

export class MonthSelectorData {
  current_month: number;
  current_year: number;
  showActive: boolean;
  allowedMonths?: number[];
  allowedMonthsLazy?: (number: number) => Observable<number[]>;

  constructor(current_month: number, current_year: number, allowedMonths = [], showActive = true) {
    this.current_month = current_month;
    this.current_year = current_year;
    this.allowedMonths = allowedMonths;
    this.showActive = showActive;
  }
}

