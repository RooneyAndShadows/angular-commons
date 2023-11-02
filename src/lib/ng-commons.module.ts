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
import {TabViewItemComponent} from "./components/tab-view/tab-view-item.component";
import {TabViewComponent} from "./components/tab-view/tab-view.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    CeilPipe,
    DefaultPipe,
    ReplacePipe,
    ConfirmationDialogComponent,
    LoadingComponent,
    LoadingOverlayComponent,
    TabViewItemComponent,
    TabViewComponent
  ],
    imports: [
        CommonModule,
        TranslateModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        FontAwesomeModule,
        MatButtonModule
    ],
  exports: [
    CeilPipe,
    DefaultPipe,
    ReplacePipe,
    ConfirmationDialogComponent,
    LoadingComponent,
    LoadingOverlayComponent,
    TabViewItemComponent,
    TabViewComponent
  ]
})
export class NgCommonsModule {
  constructor() {}
}
