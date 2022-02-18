import {BaseListComponent} from './BaseListComponent';
import {first} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';
import {AfterViewInit, ChangeDetectorRef, Directive, Inject, PLATFORM_ID} from '@angular/core';
import {EndlessScrollListCacheService} from '../../services/EndlessScrollListCacheService';
import {WindowRef} from '../../utils/WindowRef';

@Directive()
export abstract class EndlessScrollListComponent<DataType extends object> extends BaseListComponent implements AfterViewInit {
  protected _hasMore = true;
  protected currentPage = 0;
  protected _data: DataType[] = [];
  protected _loadingMoreData = false;
  protected abstract viewName: () => string;

  private loadScroll = false;

  get hasMore(): boolean {
    return this._hasMore;
  }

  get loadingMoreData(): boolean {
    return this._loadingMoreData;
  }

  get data(): DataType[] {
    return this._data;
  }

  scrollEvent = (event: any): void => {
    this.cacheProvider.getCacheForView(this.viewName()).scroll = event.target.scrollingElement.scrollTop;
  }

  protected constructor(protected readonly changeDetection: ChangeDetectorRef,
                        @Inject(PLATFORM_ID) protected readonly platformId: object,
                        protected readonly windowRef: WindowRef,
                        protected readonly cacheProvider: EndlessScrollListCacheService,
                        protected itemsPerPage: number = 10) {
    super();
  }

  ngAfterViewInit(): void {
    if (this.loadScroll)
      window.scroll({top:this.cacheProvider.getCacheForView(this.viewName()).scroll,left: 0,behavior: 'auto'});
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('scroll', this.scrollEvent, true);
  }

  internalOnInit() {
    super.internalOnInit();
    this.windowRef.nativeWindow.addEventListener('scroll', this.scrollEvent, true);
  }

  protected initializeData(data: DataType[], forceClearCache: boolean = false): void {
    if (this.cacheProvider.hasCacheForView(this.viewName()) && !forceClearCache) {
      [this.currentPage, this._data] = [
        this.cacheProvider.getCacheForView(this.viewName()).currentPage,
        this.cacheProvider.getCacheForView(this.viewName()).data as DataType[]
      ];
      this.loadScroll = true;
      this.loadFiltersFromCache(this.cacheProvider.getCacheForView(this.viewName()).filters);
    } else {
      this._data = data;
      this.currentPage = 0;
      if (forceClearCache)
        this.cacheProvider.clear(this.viewName());
      [this.cacheProvider.getCacheForView(this.viewName()).currentPage,
        this.cacheProvider.getCacheForView(this.viewName()).data,
        this.cacheProvider.getCacheForView(this.viewName()).filters] = [this.currentPage, this._data, this.pullFiltersToCache()];
      this.loadScroll = false;
    }
    this._hasMore = this._data.length >= this.itemsPerPage;
    this.changeDetection.markForCheck();
  }

  public onScroll(): void {
    if (!this._hasMore) {
      return;
    }
    this.cacheProvider.getCacheForView(this.viewName()).currentPage = this.currentPage = this.currentPage + 1;
    this._loadingMoreData = true;
    this.loadPage(this.itemsPerPage, this.currentPage * this.itemsPerPage)
      .pipe(first())
      .subscribe(value => {
        if (value.length > 0) {
          this.cacheProvider.getCacheForView(this.viewName()).data = this._data = this.mergeData(this._data, value);
        } else {
          this.cacheProvider.getCacheForView(this.viewName()).currentPage = this.currentPage = this.currentPage - 1;
          this._hasMore = false;
        }
        this._loadingMoreData = false;
        this.changeDetection.markForCheck();
      });
  }

  goToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.nativeWindow.scroll(0, 0);
    }
    this._data = [];
    this._hasMore = true;
    this.currentPage = -1;
    this.onScroll();
  }

  protected mergeData(currentData: DataType[], newData: DataType[]): DataType[] {
    return [...this._data, ...newData];
  }

  protected loadFiltersFromCache(filters: any[]): void {}

  protected pullFiltersToCache(): any[] {
    return [];
  }

  protected abstract loadPage(take: number, skip: number): Observable<DataType[]>;
}


