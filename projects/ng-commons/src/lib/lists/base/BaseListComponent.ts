import {BaseComponent} from '../../components/BaseComponent';

export abstract class BaseListComponent extends BaseComponent {
  static get lastLoadedListComponents(): string | undefined {
    return this._lastLoadedListComponents;
  }

  private static _lastLoadedListComponents?: string;

  protected _loading = false;
  protected _errorMessage: string = '';
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

  async internalOnInit() {
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

  public toggleSelectedInChain() {
    if (this.toggleList.length > 0) {
      this.startProcessing();
      this.toggleNextSelectedInChain();
    }
  }

  protected toggleNextSelectedInChain() {
    if (this._toggleWorkingList.length > 0) {
      const currentId = this._toggleWorkingList.pop();
      this.toggleElementById(currentId as string).then(() => {});
    } else {
      this._processing = this._loading = false;
      this.toggleEnd();
    }
  }

  public async toggleElementById(currentId: string, recursive = true) {
    const result = this.isEnabled(currentId) ?
      this.disableById :
      this.enableById;

    if (!this._processing) {
      this.startProcessing();
    }
    result(currentId).then(() => {
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

  protected toggleEnd(): void {
    this._toggleList = this._toggleWorkingList;
  }

}
