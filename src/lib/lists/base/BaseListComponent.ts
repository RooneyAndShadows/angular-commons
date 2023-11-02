import {BaseComponent} from '../../components/BaseComponent';
import {MatDialog} from "@angular/material/dialog";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData
} from "../../components/confirmation-dialog/confirmation-dialog.component";
import {first} from "rxjs/operators";

export abstract class BaseListComponent extends BaseComponent {
  static get lastLoadedListComponents(): string | undefined {
    return this._lastLoadedListComponents;
  }

  private static _lastLoadedListComponents?: string;

  protected _loading = false;
  protected _errorMessage: string = '';
  protected _toggleList: string[] = [];
  protected _processing = false;

  get toggleList(): string[] {
    return this._toggleList;
  }

  get processing(): boolean {
    return this._processing;
  }

  get loading(): boolean {
    return this._loading;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  protected constructor() {
    super();
  }

  override async internalOnInit() {
    await super.internalOnInit();
    BaseListComponent._lastLoadedListComponents = this.constructor.name;
  }

  public selectAll(list: string[]) {
    list.forEach((value) => {
      if (this._toggleList.indexOf(value) < 0) {
        this._toggleList.push(value);
      }
    });
  }

  public deselectAll() {
    this._toggleList = [];
  }

  public addOrRemoveFromToggleList(key: string) {
    if (this._toggleList.indexOf(key) < 0) {
      this._toggleList.push(key);
    } else {
      this._toggleList = this._toggleList.filter(x => x !== key);
    }
  }

  public async toggleSelectedWithConfirmation(matDialog: MatDialog, data: ConfirmationDialogData, onSuccess?: () => void, onFailed?: (partialSuccess: boolean, error: any) => void) {
    const result: boolean = await matDialog.open(ConfirmationDialogComponent, {
      maxWidth: "500px",
      data: data
    }).afterClosed().pipe(first()).toPromise();
    if (result)
      this.toggleSelected(onSuccess, onFailed);
  }

  public toggleSelected(onSuccess?: () => void, onFailed?: (partialSuccess: boolean, error: any) => void) {
    if (this.processing)
      return;
    if (this.toggleList.length > 0) {
      this.processingStart();
      const disabled = this._toggleList.filter(x => !this.isEnabled(x));
      const enabled = this._toggleList.filter(x => this.isEnabled(x));

      this.disableAllById(enabled).then(() => {
        this._toggleList = disabled;
        this.enableAllById(disabled).then(() => {
          this._toggleList = [];
          if (onSuccess !== undefined) onSuccess();
        }).catch(reason => {
          this.processingFailed(reason);
          if (onFailed !== undefined) onFailed(true, reason);
        }).finally(() => this.processingEnd());
      }).catch(reason => {
        this.processingEnd();
        this.processingFailed(reason);
        if (onFailed !== undefined) onFailed(false, reason);
      });
    }
  }

  public async toggleElementById(currentId: string, onSuccess?: () => void, onFailed?: (reason: any) => void) {
    if (this.processing)
      return;

    const result = this.isEnabled(currentId) ?
      this.disableById :
      this.enableById;

    if (!this._processing) {
      this.processingStart();
    }
    result(currentId).then(() => {
      if (onSuccess !== undefined) onSuccess();
    }, error => {
      this.processingFailed(error);
      if (onFailed !== undefined) onFailed(error);
    }).finally(() => this.processingEnd());
  }

  protected async enableById(id: string): Promise<void> {
    return new Promise((resolve) => resolve());
  }

  protected async disableById(id: string): Promise<void> {
    return new Promise((resolve) => resolve());
  }

  protected async enableAllById(ids: string[]): Promise<void> {
    return new Promise((resolve) => resolve());
  }

  protected async disableAllById(ids: string[]): Promise<void> {
    return new Promise((resolve) => resolve());
  }

  protected isEnabled(id: string): boolean {
    return true;
  }

  protected processingEnd(): void {
    this._processing = this._loading = false;
  }

  protected processingFailed(error?: string) {
    if (error !== undefined) {
      console.log(error);
    }
  }

  private processingStart() {
    this._processing = true;

    setTimeout(() => {
      if (this._processing) {
        this._loading = true;
      }
    }, 100);
  }
}
