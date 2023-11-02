import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {IconPickerDialogComponent, IconPickerDialogData} from '../dialog/icon-picker-dialog.component';
import {IconLookup, IconProp} from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-category-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss'],
  exportAs: 'iconPicker'
})
export class IconPickerComponent implements OnInit {
  //@ts-ignore
  @Input() icon: IconProp;
  @Input() color = 'green';
  @Output() iconChange: EventEmitter<IconProp> = new EventEmitter<IconProp>();

  @Input() allowedIcons: IconProp[] = [];
  @Input() phrase: string = 'Pick an icon';

  //@ts-ignore
  @ViewChild('form', {static: true}) private ngForm: NgForm;

  constructor(public dialog: MatDialog, public detector: ChangeDetectorRef) { }

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(IconPickerDialogComponent, {
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      data: new IconPickerDialogData(this.icon, this.allowedIcons, this.color)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.icon = result;
        this.iconChange.emit(this.icon);
        this.detector.detectChanges();
      }
    });
  }
}


