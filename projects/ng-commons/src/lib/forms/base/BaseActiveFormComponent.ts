import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {finalize, single} from 'rxjs/operators';
import {EndlessScrollListCache} from '../../services/EndlessScrollListCacheService';
import {LocaleStringsService} from '../../services/LocaleStringsService';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BaseComponent} from '../../components/BaseComponent';

export class BaseActiveFormComponent extends BaseComponent {
  protected _submitting = false;
  protected _success = false;
  protected _posted = false;
  protected _errorMessage: string = '';

  constructor(public localeService: LocaleStringsService, protected router: Router, protected snackbar: MatSnackBar) {
    super();
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  get posted(): boolean {
    return this._posted;
  }

  get success(): boolean {
    return this._success;
  }

  get submitting(): boolean {
    return this._submitting;
  }

  protected submitWrapper<TResponse>(fn: () => Observable<TResponse>, redirectUrlOnSuccess = '',
                                     reloadOnSuccess = false, onSuccess?: (response: TResponse) => void,
                                     onError?: (error: any) => void, showSnackbar = true,
                                     showRedirectSnackbar = true): void {
    this._submitting = true;
    this._errorMessage = '';
    fn()
      .pipe(
        single(),
        finalize(() => {
          this._posted = true;
          this._submitting = false;
        })
      )
      .subscribe(
        result => {
          this._success = true;
          if (showSnackbar && showRedirectSnackbar) {
            this.snackbar.open(
              this.localeService.getStringOrDefault('active_form_redirecting', 'Your request was successful! You are being redirected...'),
              this.localeService.getStringOrDefault('system_action_close_phrase', 'Close'),
              {
                duration: 2500,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              });
          }
          if (reloadOnSuccess) {
            // TODO: Router
          } else if (onSuccess !== undefined) {
            onSuccess(result);
          } else if (redirectUrlOnSuccess != null && redirectUrlOnSuccess.length > 0) {
            let {mainUrl, query} = this.splitUrlParts(redirectUrlOnSuccess);
            this.router.navigate([mainUrl], {
              queryParams: query
            });
          }
        },
        errorResult => {
          this._success = false;
          if (onError !== undefined)
            onError(errorResult);
          else {
            let error =
               this.localeService.getStringOrDefault(
                 'system_error_loading_data_phrase',
                 `An error occurred while processing your request! Please, try again later.`);
            this._errorMessage = error;
            if (showSnackbar) {
              this.snackbar.open(error,
                this.localeService.getStringOrDefault('system_action_close_phrase', 'Close'), {
                duration: 10000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              });
            }
          }
        }
      );
  }

  protected findCacheManipulationPositionIndexes<EntryType>(cache: EntryType[], newEntry: EntryType,
                                                            greaterThan?: (left: EntryType, right: EntryType) => boolean,
                                                            searchOld = true,
                                                            areEqual: (left: EntryType, right: EntryType) => boolean = () => false) {
    let oldElementPosition = null;
    let newElementPosition = -1;
    for (let index = 0; index < cache.length; index++) {
      const entry: EntryType = cache[index];
      if (newElementPosition < 0) {
        if (greaterThan !== undefined && greaterThan(newEntry, entry)) {
          newElementPosition = index;
          if (oldElementPosition !== null || !searchOld) {
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

  protected addNewEntryToCache<EntryType extends object>(cacheElement: EndlessScrollListCache, newEntry: EntryType,
                                                         greaterThan: (left: EntryType, right: EntryType) => boolean,
                                                         areEqual: (left: EntryType, right: EntryType) => boolean,
                                                         loadPage: (skip: number, take: number) => Observable<EntryType[]>,
                                                         successUrl: string, itemsPerPage: number) {
    const cache = cacheElement.data as EntryType[];
    let {
      newElementPosition
    } = this.findCacheManipulationPositionIndexes(cache, newEntry, greaterThan, false, areEqual);
    let {mainUrl, query} = this.splitUrlParts(successUrl);

    cache.splice(newElementPosition, 0, newEntry);
    if ((cacheElement.currentPage + 1) * itemsPerPage < cache.length) {
      cache.splice(cache.length - 1, 1);
    }
    this.router.navigate([mainUrl], {queryParams: query});
  }

  protected addNewEntryToCacheWithStrictList<EntryType extends object>(cacheElement: EndlessScrollListCache, newEntry: EntryType,
                                                                       greaterThan: (left: EntryType, right: EntryType) => boolean,
                                                                       areEqual: (left: EntryType, right: EntryType) => boolean,
                                                                       loadPage: (skip: number, take: number) => Observable<EntryType[]>,
                                                                       itemsPerPage: number,
                                                                       successUrl: string, isEmpty?: (previous: EntryType) => boolean) {
  }

  protected replaceEntryAtCache<EntryType extends object>(cacheElement: EndlessScrollListCache, newEntry: EntryType,
                                                          greaterThan: (left: EntryType, right: EntryType) => boolean,
                                                          areEqual: (left: EntryType, right: EntryType) => boolean,
                                                          loadPage: (skip: number, take: number) => Observable<EntryType[]>,
                                                          successUrl: string, itemsPerPage: number) {
    const cache = cacheElement.data as EntryType[];
    let {
      oldElementPosition,
      newElementPosition
    } = this.findCacheManipulationPositionIndexes(cache, newEntry, greaterThan, true, areEqual);
    let {mainUrl, query} = this.splitUrlParts(successUrl);

    //ADD NEW ONE
    cache.splice(newElementPosition, 0, newEntry);
    if (oldElementPosition != null) {
      // REMOVE OLD ONE UNEDITED; INDEX OF HAS TO BE OPTIMIZED
      cache.splice(newElementPosition <= oldElementPosition ? oldElementPosition + 1 : oldElementPosition, 1);
    }

    if (!areEqual(cache[cache.length - 1], newEntry)) {
      this.router.navigate([mainUrl], {queryParams: query});
    } else {
      //REALOAD LAST PAGE
      loadPage(cacheElement.currentPage * itemsPerPage, itemsPerPage)
        .subscribe(value => {
          cacheElement.data.splice(cacheElement.currentPage * itemsPerPage, itemsPerPage);
          cacheElement.data.push(...value);
          this.router.navigate([mainUrl], {queryParams: query});
        });
    }
  }

  protected removeEntryAtCache<EntryType extends object>(cacheElement: EndlessScrollListCache, newEntry: EntryType,
                                                         areEqual: (left: EntryType, right: EntryType) => boolean,
                                                         loadPage: (skip: number, take: number) => Observable<EntryType[]>,
                                                         successUrl: string, itemsPerPage: number,
                                                         fillInGapWithEmpty?: (previous?: EntryType, next?: EntryType) => boolean, emptyItem?: EntryType) {
    const cache = cacheElement.data as EntryType[];
    let {
      oldElementPosition
    } = this.findCacheManipulationPositionIndexes(cache, newEntry, undefined, true, areEqual);

    if (oldElementPosition != null) {
      const prev = oldElementPosition > 0 ? cache[oldElementPosition - 1] : undefined;
      const next = oldElementPosition < cache.length - 1 ? cache[oldElementPosition + 1] : undefined;
      cache.splice(oldElementPosition, 1);
      if (fillInGapWithEmpty !== undefined && emptyItem !== undefined && fillInGapWithEmpty(prev, next)) {
        cache.splice(oldElementPosition, 0, emptyItem);
      }
    }

    loadPage(cacheElement.currentPage * itemsPerPage, itemsPerPage)
      .subscribe(value => {
        cacheElement.data.splice(cacheElement.currentPage * itemsPerPage, itemsPerPage);
        cacheElement.data.push(...value);

        if (successUrl != '') {
          let {mainUrl, query} = this.splitUrlParts(successUrl);
          this.router.navigate([mainUrl], {queryParams: query});
        }
      });
  }

  protected splitUrlParts(url: string) {
    const parts = url.split('?');
    const mainUrl = parts[0];
    let params: any = {}, queries, temp, i, l;

    if (parts.length > 1) {
      queries = parts[1].split('&');
      for (i = 0, l = queries.length; i < l; i++) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
      }
    }
    return {mainUrl: mainUrl, query: params};
  }
}

type ActiveFormStrings = 'general_error';

