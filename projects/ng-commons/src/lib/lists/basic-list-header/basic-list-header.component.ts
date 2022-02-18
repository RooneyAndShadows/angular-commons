import {Component, ContentChildren, EventEmitter, Input, Output, QueryList} from '@angular/core';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-basic-list-header',
  templateUrl: './basic-list-header.component.html',
  styleUrls: []
})
export class BasicListHeaderComponent {
  @Input() processing = false;
  @Input() refreshLink?: string;
  @Input() createLink?: string;
  @Output() hideSelected: EventEmitter<any> = new EventEmitter();
  @Output() deleteSelected: EventEmitter<any> = new EventEmitter();
  @Output() selectAll: EventEmitter<any> = new EventEmitter();
  @Output() deselectAll: EventEmitter<any> = new EventEmitter();

  //@ts-ignore
  @ContentChildren(MatButton) buttons: QueryList<MatButton>;

  constructor() {}
}
