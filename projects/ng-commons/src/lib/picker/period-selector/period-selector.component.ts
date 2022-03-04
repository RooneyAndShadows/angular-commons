import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: []
})
export class PeriodSelectorComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PeriodSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodSelectorData) {}

  ngOnInit(): void {
  }

  chosenDate(chosenDate: any): void {
    this.data.start = chosenDate.startDate.toDate();
    this.data.end = chosenDate.endDate.toDate();

    this.dialogRef.close(this.data);
  }
}

export class PeriodSelectorData {
  start: Date;
  end: Date;

  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }
}
