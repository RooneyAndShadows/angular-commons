import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgCommonsModule} from '../ng-commons.module';
import {MatButtonModule} from '@angular/material/button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {IconPickerDialogComponent} from './icon-picker/dialog/icon-picker-dialog.component';
import {IconPickerComponent} from './icon-picker/picker/icon-picker.component';
import {MatIconModule} from '@angular/material/icon';
import {ColorPickerComponent} from './color-picker/picker/color-picker.component';
import {ColorPickerDialogComponent} from './color-picker/dialog/color-picker-dialog.component';
import {MonthSelectorComponent} from './month-selector/month-selector.component';
import {PeriodSelectorComponent} from './period-selector/period-selector.component';
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';


@NgModule({
  declarations: [
    IconPickerDialogComponent,
    IconPickerComponent,
    ColorPickerComponent,
    ColorPickerDialogComponent,
    MonthSelectorComponent,
    PeriodSelectorComponent
  ],
  imports: [
    CommonModule,
    NgCommonsModule,
    FontAwesomeModule,
    MatButtonModule,
    MatIconModule,
    NgxDaterangepickerMd,

  ],
  exports: [
    NgCommonsModule,
    IconPickerDialogComponent,
    IconPickerComponent,
    ColorPickerComponent,
    ColorPickerDialogComponent,
    MonthSelectorComponent,
    PeriodSelectorComponent
  ]
})
export class PickerModule {
  constructor() {}
}
