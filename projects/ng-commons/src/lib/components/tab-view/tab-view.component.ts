import {Component, ContentChildren, ElementRef, EventEmitter, OnInit, Output, QueryList, Renderer2, ViewChild} from '@angular/core';
import {TabViewItemComponent} from './tab-view-item.component';

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html'
})
export class TabViewComponent {
  private _selectedTab = 0;

  //@ts-ignore
  @ViewChild('container') container: ElementRef;
  //@ts-ignore
  @ContentChildren(TabViewItemComponent) tabItems: QueryList<TabViewItemComponent>;
  @Output() tabChanged = new EventEmitter<number>();

  get selectedTab(): number {
    return this._selectedTab;
  }

  set selectedTab(value: number) {
    if (value == this._selectedTab || this.tabItems.get(value) === undefined)
      return;
    (this.tabItems.get(this._selectedTab) as TabViewItemComponent).selected = false;
    this._selectedTab = value;
    (this.tabItems.get(this._selectedTab) as TabViewItemComponent).selected = true;
    this.tabChanged.emit(value);
  }
}



