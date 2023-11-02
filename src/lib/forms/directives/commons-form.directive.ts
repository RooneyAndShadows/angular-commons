import {AfterContentInit, ContentChildren, Directive, Input, QueryList,} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {BaseInputField} from '../../form-fields/base/BaseInputField';


@Directive({
  selector: 'form[appCommonsForm]'
})
export class CommonsFormDirective implements AfterContentInit {
  //@ts-ignore
  @ContentChildren('app-input-field', {descendants: true}) protected appInputFields: QueryList<BaseInputField>;
  //@ts-ignore
  @ContentChildren(MatButton, {descendants: true}) protected buttons: QueryList<MatButton>;
  private _disableFields = false;

  @Input() debug = false;

  constructor(protected form: NgForm) {}

  @Input() set disableFields(value: boolean) {
    this._disableFields = value;
    if (this.appInputFields !== null && typeof this.appInputFields !== 'undefined') {
      this.appInputFields.forEach(item => item.setDisabled(value));
    }
    if (this.buttons !== null && typeof this.buttons !== 'undefined') {
      this.buttons.forEach(item => {
        item.disabled = value;
        if (value) {
          item._elementRef.nativeElement.classList.add("spinner");
        } else {
          item._elementRef.nativeElement.classList.remove("spinner");
        }
      });
    }
  }

  ngAfterContentInit(): void {
    if (this.debug) {
      console.log('Passive form loaded!');
      console.log('FORM', this.form);
      console.log('Fields', this.appInputFields.toArray());
      console.log('Buttons', this.buttons.toArray());
    }
  }

  public markAllAsTouched(): boolean {
    if (this.form !== null && typeof this.form !== 'undefined') {
      // tslint:disable-next-line:forin
      for (const i in this.form.controls) {
        this.form.controls[i].markAsTouched();
      }
    }
    this.appInputFields.forEach(value => value.markAsTouched());
    return true;
  }

  public valid(): boolean {
    return this.appInputFields.filter(value => !value.valid()).length === 0;
  }
}
