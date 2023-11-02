import {Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-tab-view-item',
  templateUrl: './tab-view-item.component.html'
})
export class TabViewItemComponent {
  @Input()
  set selected(value: boolean) {
    if (value === this._selected)
      return;
    this._selected = value;
    this.selectedPropertyChanged.emit(value);
  }
  private _selected = false;

  @Input() title: string = '';
  @Input() icon?: IconProp;

  //@ts-ignore
  @ViewChild(TemplateRef, {static: true}) implicitContent: TemplateRef<any>;
  @Output() selectedPropertyChanged = new EventEmitter<boolean>();

  public constructor() {
  }
}
