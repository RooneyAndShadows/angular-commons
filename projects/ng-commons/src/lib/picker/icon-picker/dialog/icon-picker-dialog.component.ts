import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IconLookup, IconProp} from '@fortawesome/fontawesome-svg-core';

@Component({
  templateUrl: './icon-picker-dialog.component.html',
  styleUrls: ['./icon-picker-dialog.component.scss']
})
export class IconPickerDialogComponent {
  selected?: IconProp;

  constructor(
    public dialogRef: MatDialogRef<IconPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IconPickerDialogData) {
    this.selected = data.icon;
  }

  onClick(icon: IconProp): void {
    this.data.icon = icon;
    this.selected = icon;
  }
}

export class IconPickerDialogData {
  icon: IconProp;
  allowed_icons: IconProp[];
  color: string;

  constructor(icon: IconProp, allowed_icons: IconProp[], color: string = 'green') {
    this.color = color;
    this.icon = icon;
    this.allowed_icons = allowed_icons;
  }
}
