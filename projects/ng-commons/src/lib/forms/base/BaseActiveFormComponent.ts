import {Observable} from 'rxjs';
import {finalize, single} from 'rxjs/operators';
import {LocaleStringsService} from '../../services/LocaleStringsService';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BaseComponent} from '../../components/BaseComponent';

export class BaseActiveFormComponent extends BaseComponent {
  protected _submitting = false;
  protected _success = false;
  protected _posted = false;
  protected _errorMessage: string = '';

  constructor(public localeService: LocaleStringsService, protected snackbar: MatSnackBar) {
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

  protected submitWrapper<TResponse>(fn: () => Observable<TResponse>, onSuccess?: (response: TResponse) => void,
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
          if (onSuccess !== undefined) {
            onSuccess(result);
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
}

