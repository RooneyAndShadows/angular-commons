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

  private static findCacheManipulationPositionIndexes<EntryType>(cache: EntryType[], newEntry: EntryType,
                                                                 greaterThan?: (left: EntryType, right: EntryType) => boolean,
                                                                 areEqual: (left: EntryType, right: EntryType) => boolean = () => false,
                                                                 searchOld = true): {oldElementPosition?: number; newElementPosition?: number} {
    let oldElementPosition = undefined;
    let newElementPosition = -1;
    for (let index = 0; index < cache.length; index++) {
      const entry: EntryType = cache[index];
      if (newElementPosition < 0) {
        if (greaterThan !== undefined && greaterThan(newEntry, entry)) {
          newElementPosition = index;
          if (oldElementPosition !== undefined || !searchOld) {
            break;
          }
        }
      }
      if (searchOld && areEqual(entry, newEntry)) {
        oldElementPosition = index;
        if (newElementPosition >= 0) {
          break;
        }
      }
    }
    if (newElementPosition < 0) {
      newElementPosition = cache.length;
    }
    return {oldElementPosition: oldElementPosition, newElementPosition: newElementPosition};
  }

  public addOrReplaceEntryAtCache<EntryType extends object>(cacheElement: EndlessScrollListCache, newEntry: EntryType,
                                                          greaterThan: (left: EntryType, right: EntryType) => boolean,
                                                          areEqual: (left: EntryType, right: EntryType) => boolean) {
    const cache = cacheElement.data as EntryType[];
    let {
      oldElementPosition,
      newElementPosition
    } = EndlessScrollListCacheService.findCacheManipulationPositionIndexes(cache, newEntry, greaterThan, areEqual);
    if (newElementPosition === undefined)
      throw new Error("Failed to find position for new element!");
    //ADD NEW ONE
    cache.splice(newElementPosition, 0, newEntry);
    if (oldElementPosition != null) {
      // REMOVE OLD ONE UNEDITED; INDEX OF HAS TO BE OPTIMIZED
      cache.splice(newElementPosition <= oldElementPosition ? oldElementPosition + 1 : oldElementPosition, 1);
    }
    return cache.indexOf(newEntry);
  }

  public removeEntryAtCache<EntryType extends object>(cacheElement: EndlessScrollListCache, entryToRemove: EntryType,
                                                         areEqual: (left: EntryType, right: EntryType) => boolean) {
    const cache = cacheElement.data as EntryType[];
    let {
      oldElementPosition
    } = EndlessScrollListCacheService.findCacheManipulationPositionIndexes(cache, entryToRemove, undefined, areEqual, true);

    if (oldElementPosition !== undefined) {
      cache.splice(oldElementPosition, 1);
    }
    return oldElementPosition;
  }
}

export class EndlessScrollListCache {
  public scroll = 0;
  public currentPage = 0;
  public data: object[] = [];
  public filters: any[] = [];
  public loadedUrl: any[] = [];
}
