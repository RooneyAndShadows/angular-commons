import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

@Directive({
  selector: '[appCustomMin]',
  providers: [{provide: NG_VALIDATORS, useExisting: CustomMaxNumberDirective, multi: true}]
})
export class CustomMaxNumberDirective implements Validator {
  // @ts-ignore
  @Input('appCustomMax') max?: number;

  validate(control: AbstractControl): ValidationErrors | null {
    return this.max !== undefined ? customMaxFunction(this.max)(control) : null;
  }
}

export function customMaxFunction(max: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const float = parseFloat(control.value);
    if (isNaN(float)) {
      return null;
    }
    return float > max ? {'appCustomMax': {value: control.value}} : null;
  };
}
