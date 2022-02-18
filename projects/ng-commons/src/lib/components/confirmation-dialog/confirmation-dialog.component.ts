import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) { }

  ngOnInit(): void {
  }

  public confirm() {
    this.dialogRef.close(true);
  }

  public cancel() {
    this.dialogRef.close(false);
  }
}

export class ConfirmationDialogData {
  public readonly message;
  public confirmed = false;

  constructor(message: string) {
    this.message = message;
  }
}
