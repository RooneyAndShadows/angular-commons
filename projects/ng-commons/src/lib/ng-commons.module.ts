import { NgModule } from '@angular/core';
import {CeilPipe} from './pipe/CeilPipe';
import {DefaultPipe} from './pipe/DefaultPipe';
import {ReplacePipe} from './pipe/ReplacePipe';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ConfirmationDialogComponent} from './components/confirmation-dialog/confirmation-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {LoadingComponent} from './components/loading/loading.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LoadingOverlayComponent} from './components/loading-overlay/loading-overlay.component';

@NgModule({
  declarations: [
    CeilPipe,
    DefaultPipe,
    ReplacePipe,
    ConfirmationDialogComponent,
    LoadingComponent,
    LoadingOverlayComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  exports: [
    CeilPipe,
    DefaultPipe,
    ReplacePipe,
    ConfirmationDialogComponent,
    LoadingComponent,
    LoadingOverlayComponent
  ]
})
export class NgCommonsModule {
  constructor() {}
}
