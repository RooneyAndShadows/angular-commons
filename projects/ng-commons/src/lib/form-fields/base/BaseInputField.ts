import {ControlValueAccessor, ValidationErrors} from '@angular/forms';

export interface BaseInputField extends ControlValueAccessor {
  markAsTouched(): void;
  valid(): boolean;
  setDisabled(value: boolean): void;

  errors(): ValidationErrors | null;
}

