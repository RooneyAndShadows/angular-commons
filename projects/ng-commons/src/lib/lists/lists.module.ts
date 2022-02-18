import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgCommonsModule} from '../ng-commons.module';
import {BasicListHeaderComponent} from './basic-list-header/basic-list-header.component';
import {MatButtonModule} from '@angular/material/button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    BasicListHeaderComponent
  ],
  imports: [
    CommonModule,
    NgCommonsModule,
    MatButtonModule,
    FontAwesomeModule,
    RouterModule
  ],
  exports: [
    NgCommonsModule,
    BasicListHeaderComponent
  ]
})
export class ListsModule {
  constructor() {}
}
