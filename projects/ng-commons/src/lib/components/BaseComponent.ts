import {Directive, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ObjectColletionUtils} from '../utils/ObjectColletionUtils';

@Directive()
export class BaseComponent implements OnInit, OnDestroy {
  private _collectionUtils: ObjectColletionUtils = ObjectColletionUtils.build();
  protected readonly now = new Date();
  protected readonly subscriptionList: Subscription[] = [];

  constructor() { }

  get collectionUtils() {
    return this._collectionUtils;
  }

  reload(): void {
    window.location.reload();
  }

  ngOnInit(): void {
    this.internalOnInit();
  }

  internalOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptionList.forEach(x => x.unsubscribe());
  }
}
