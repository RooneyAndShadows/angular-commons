import {AfterViewInit, Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgModel, ValidationErrors} from '@angular/forms';
import {BaseInputField} from '../base/BaseInputField';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {MatFormFieldAppearance} from "@angular/material/form-field";

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
    {
      provide: 'app-input-field',
      useExisting: TextFieldComponent
    }
  ]
})
export class TextFieldComponent implements BaseInputField, OnDestroy, OnInit, AfterViewInit {
  @Input() value: string = '';
  @Input() placeholder: string = '';
  @Input() type = 'text';
  @Input() name = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() multiline = false;
  @Input() maxlength = 0;
  @Input() minlength = 0;
  @Input() icon?: IconProp;
  @Input() iconPositionPrefix = true;
  @Input() showError = true;
  @Input() errorMessages: {[key in TextBoxErrorMessages]?: string} = {};
  @Input() appearance: MatFormFieldAppearance = 'fill'

  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
  initialized = false;

  @ViewChild(NgModel) input!: NgModel;

  constructor() {}

  setDisabled(value: boolean): void {
    this.disabled = value;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  propagateChange = (_: any) => {
  };
  propagateTouch = (_: any) => {
  };

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  writeValue(obj: any): void {
      this.value = obj;
  }

  internalChangeValue(obj: any): void {
    this.value = obj;
    this.propagateChange(this.value);
  }

  markAsTouched(): void {
    this.input.control.markAsTouched();
  }

  valid(): boolean {
    return this.input.valid !== false;
  }

  ngAfterViewInit(): void {
    this.initialized = true;
  }

  isLastCharacterDecimalSeparator(value: any) {
    return isNaN(value[value.length - 1]);
  }

  errors(): ValidationErrors | null {
    return this.input.errors;
  }
}
type TextBoxErrorMessages = 'email' | 'maxlength' | 'minlength' | 'required';
