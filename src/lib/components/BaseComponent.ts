import {Directive, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ObjectColletionUtils} from '../utils/ObjectColletionUtils';

@Directive()
export class BaseComponent implements OnInit, OnDestroy {
  protected readonly _collectionUtils: ObjectColletionUtils = ObjectColletionUtils.build();
  protected readonly now = new Date();
  protected readonly subscriptionList: Subscription[] = [];

  private _initialized: boolean = false;

  get initialized(): boolean {
    return this._initialized;
  }

  constructor() { }

  get collectionUtils() {
    return this._collectionUtils;
  }

  reload(): void {
    window.location.reload();
  }

  async ngOnInit(): Promise<void> {
    await this.internalOnInit();
    this._initialized = true;
  }

  async internalOnInit(): Promise<void> {}

  ngOnDestroy(): void {
    this.subscriptionList.forEach(x => x.unsubscribe());
  }
}
