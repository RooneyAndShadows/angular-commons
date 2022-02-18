import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

@Directive({
  selector: '[appCustomMin]',
  providers: [{provide: NG_VALIDATORS, useExisting: CustomMinNumberDirective, multi: true}]
})
export class CustomMinNumberDirective implements Validator {
  // @ts-ignore
  @Input('appCustomMin') min?: number;

  validate(control: AbstractControl): ValidationErrors | null {
    return this.min !== undefined ? customMinFunction(this.min)(control) : null;
  }
}

export function customMinFunction(min: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const float = parseFloat(control.value);
    if (isNaN(float)) {
      return null;
    }
    return float < min ? {'appCustomMin': {value: control.value}} : null;
  };
}
