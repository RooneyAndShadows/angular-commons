import {Injectable} from '@angular/core';

@Injectable({
  providedIn: "root"
})
export class EndlessScrollListCacheService {
  private _cache: Map<string, EndlessScrollListCache> = new Map<string, EndlessScrollListCache>();

  public getCacheForView(view: string): EndlessScrollListCache {
    if (!this._cache.has(view)) {
      this._cache.set(view, new EndlessScrollListCache());
    }
    return this._cache.get(view) as EndlessScrollListCache;
  }

  public hasCacheForView(view: string): boolean {
    return this._cache.has(view);
  }

  public clear(view: string): boolean {
    return this._cache.delete(view);
  }
}

export class EndlessScrollListCache {
  public scroll = 0;
  public currentPage = 0;
  public data: object[] = [];
  public filters: any[] = [];
  public loadedUrl: any[] = [];
}
