import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  templateUrl: './color-picker-dialog.component.html',
  styleUrls: ['./color-picker-dialog.component.scss']
})
export class ColorPickerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ColorPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ColorPickerDialogData) {}

  onClick(color: string): void {
    this.data.color = color;
    this.dialogRef.close(this.data.color);
  }
}

export class ColorPickerDialogData {
  color: string;
  allowed_colors: string[];

  constructor(color: string, allowed_colors: string[]) {
    this.color = color;
    this.allowed_colors = allowed_colors;
  }
}
