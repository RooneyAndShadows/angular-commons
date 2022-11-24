import { NgModule } from '@angular/core';
import {TextFieldComponent} from './text-field/text-field.component';
import {DateFieldComponent} from './date-field/date-field.component';
import {SelectFieldComponent} from './select-field/select-field.component';
import {CustomMinNumberDirective} from './number-text-field/extensions/custom-min-number-directive/custom-min-number-directive';
import {NumberTextFieldComponent} from './number-text-field/number-text-field.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {NgCommonsModule} from '../ng-commons.module';
import {MultiAutocompleteSelectComponent} from './multi-autocomplete-select/multi-autocomplete-select.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SliderComponent } from './slider/slider.component';
import {NouisliderModule} from "ng2-nouislider";
import { SliderButtonComponent } from './slider/extra/slider-button/slider-button.component';


@NgModule({
  declarations: [
    TextFieldComponent,
    NumberTextFieldComponent,
    DateFieldComponent,
    SelectFieldComponent,
    CustomMinNumberDirective,
    MultiAutocompleteSelectComponent,
    SliderComponent,
    SliderButtonComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgCommonsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    NouisliderModule
  ],
  exports: [
    TextFieldComponent,
    NumberTextFieldComponent,
    DateFieldComponent,
    SelectFieldComponent,
    CustomMinNumberDirective,
    NgCommonsModule,
    MultiAutocompleteSelectComponent,
    SliderComponent
  ]
})
export class FormFieldsModule {
  constructor() {}
}
