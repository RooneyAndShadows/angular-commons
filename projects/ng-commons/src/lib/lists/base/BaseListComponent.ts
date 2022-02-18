import {Observable, of} from 'rxjs';
import {first} from 'rxjs/operators';
import {BaseComponent} from '../../components/BaseComponent';

export abstract class BaseListComponent extends BaseComponent {
  static get lastLoadedListComponents(): string | undefined {
    return this._lastLoadedListComponents;
  }
  private static _lastLoadedListComponents?: string;

  protected _loading = false;
  protected _errorMessage: string  = '';
  protected _toggleList: string[] = [];
  protected _processing = false;
  private _toggleWorkingList: string[] = [];

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

  internalOnInit() {
    super.internalOnInit();
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

  public toggleSelectedInChain() {
    if (this.toggleList.length > 0) {
      this.startProcessing();
      this.toggleNextSelectedInChain();
    }
  }

  protected toggleNextSelectedInChain() {
    if (this._toggleWorkingList.length > 0) {
      const currentId = this._toggleWorkingList.pop();
      this.toggleElementById(currentId as string);
    } else {
      this._processing = this._loading = false;
      this.toggleEnd();
    }
  }

  public toggleElementById(currentId: string, recursive = true) {
    const result = this.isEnabled(currentId)
      ? this.disableById(currentId) :
      this.enableById(currentId);

    if (!this._processing) {
      this.startProcessing();
    }
    result.pipe(first())
      .subscribe(() => {
        this._toggleWorkingList = this._toggleWorkingList.filter(y => y !== currentId);
        if (recursive) {
          this.toggleNextSelectedInChain();
        } else {
          this._processing = this._loading = false;
          this.toggleEnd();
        }
      }, error => this.failedChainToggle(currentId, error));
  }

  protected failedChainToggle(currentId: string, error?: string) {
    if (error !== undefined) {
      console.log(error);
    }
    this._loading = false;
    this._toggleWorkingList.push(currentId);
    alert('Failed to delete selected categories! Id: ' + currentId);
  }

  private startProcessing() {
    this._processing = true;
    this._toggleWorkingList = [...this._toggleList];
    setTimeout(() => {
      if (this._processing) {
        this._loading = true;
      }
    }, 100);
  }

  protected enableById(id: string): Observable<void> {
    return of();
  }

  protected disableById(id: string): Observable<void> {
    return of();
  }

  protected enableAllById(ids: string[]): Observable<void> {
    return of();
  }

  protected disableAllById(ids: string[]): Observable<void> {
    return of();
  }

  protected isEnabled(id: string): boolean {
    return true;
  }

  protected toggleEnd(): void {
    this._toggleList = this._toggleWorkingList;
  }

}
