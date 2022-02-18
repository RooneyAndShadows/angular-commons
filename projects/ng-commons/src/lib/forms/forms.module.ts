import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgCommonsModule} from '../ng-commons.module';
import {CommonsFormDirective} from './directives/commons-form.directive';
import {MatButtonModule} from '@angular/material/button';
import {FormFieldsModule} from '../form-fields/form-fields.module';


@NgModule({
  declarations: [
    CommonsFormDirective,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    FormFieldsModule,
    NgCommonsModule
  ],
  exports: [
    NgCommonsModule,
    FormFieldsModule,
    CommonsFormDirective
  ]
})
export class FormsModule {
  constructor() {}
}
