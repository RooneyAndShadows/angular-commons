import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IconLookup} from '@fortawesome/fontawesome-svg-core';

@Component({
  templateUrl: './icon-picker-dialog.component.html',
  styleUrls: ['./icon-picker-dialog.component.scss']
})
export class IconPickerDialogComponent {
  allowedIconsGrid: IconLookup[][] = [];
  selected?: IconLookup;
  constructor(
    public dialogRef: MatDialogRef<IconPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IconPickerDialogData) {
    this.selected = {iconName: data.icon, prefix: 'fas'} as IconLookup;
    for (let i = 0; i < this.data.allowed_icons.length / 4; i++) {
      for (let j = 0; j < Math.min(4, this.data.allowed_icons.length - ((i * 4) + j)); j++) {
        if (typeof this.allowedIconsGrid[i] === 'undefined') {
          this.allowedIconsGrid[i] = [];
        }
        this.allowedIconsGrid[i][j] = {prefix: "fas", iconName: this.data.allowed_icons[((i * 4) + j)]} as IconLookup;
      }
    }
  }

  onClick(icon: IconLookup): void {
    this.data.icon = icon.iconName;
    this.selected = icon;
  }
}

export class IconPickerDialogData {
  icon: string;
  allowed_icons: string[];
  color: string;

  constructor(icon: string, allowed_icons: string[], color: string = 'green') {
    this.color = color;
    this.icon = icon;
    this.allowed_icons = allowed_icons;
  }
}
