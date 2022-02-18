import {ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ColorPickerDialogComponent, ColorPickerDialogData} from '../dialog/color-picker-dialog.component';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.sass'],
  exportAs: 'colorPicker'
})
export class ColorPickerComponent implements OnInit {
  @Input() allowedColors: string[] = [];
  @Input() color?: string = undefined;
  @Output() colorChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() phrase: string = 'Pick a color';

  //@ts-ignore
  @ViewChild('form', {static: true}) private ngForm: NgForm;

  constructor(public dialog: MatDialog, public detector: ChangeDetectorRef) { }

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ColorPickerDialogComponent, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      data: new ColorPickerDialogData(this.color ?? '', this.allowedColors)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.color = result;
        this.colorChange.emit(this.color);
        this.detector.detectChanges();
      }
    });
  }
}
