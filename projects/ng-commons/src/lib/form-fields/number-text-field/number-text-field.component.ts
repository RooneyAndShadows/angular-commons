import {AfterViewInit, Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgModel, ValidationErrors} from '@angular/forms';
import {formatNumber} from '@angular/common';
import {BaseInputField} from '../base/BaseInputField';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-number-text-field',
  templateUrl: './number-text-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberTextFieldComponent),
      multi: true,
    },
    {
      provide: 'app-input-field',
      useExisting: NumberTextFieldComponent
    }
  ]
})
export class NumberTextFieldComponent implements BaseInputField, OnDestroy, OnInit, AfterViewInit {
  @Input() value?: number;
  @Input() placeholder: string = '';
  @Input() name = '';
  @Input() min?: number;
  @Input() icon?: IconProp;
  @Input() iconColor = '';
  @Input() iconPositionPrefix = true;
  @Input() zeroDisplay?: string;
  @Input() showError = true;
  @Input() float = true;
  @Input() disabled = false;
  @Input() required = false;
  @Input() errorMessages: {[key in NumberFieldErrorMessages]?: string} = {};

  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  initialized = false;
  private decimalMarker?: string;
  displayValue: string = '';

  // @ts-ignore
  @ViewChild(NgModel) input: NgModel = null;

  constructor() {
  }

  ngOnInit(): void {
    this.formatValue();
  }

  ngOnDestroy() {
  }

  setDisabled(value: boolean): void {
    this.disabled = value;
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
    let float = parseFloat(obj);
    if (isNaN(float)) {
      float = 0;
      this.propagateChange(float);
    }
    this.value = float;
    this.formatValue();
  }

  internalChangeValue(obj: any): void {
    let float = parseFloat(obj);
    if (isNaN(float)) {
      float = 0;
    }
    this.value = float;
    this.displayValue = '';
    this.propagateChange(this.value);
  }

  markAsTouched(): void {
    this.input.control.markAsTouched();
  }

  valid(): boolean {
    return (this.input.valid ?? false) || this.disabled;
  }

  ngAfterViewInit(): void {
    this.initialized = true;
  }

  isLastCharacterDecimalSeparator(value: any) {
    return isNaN(value[value.length - 1]);
  }

  formatValue() {
    this.displayValue =
      this.value === 0 && this.zeroDisplay !== undefined ?
        this.zeroDisplay ?? '' :
        formatNumber(this.value ?? 0, 'en', this.float ? '1.2-2' : '1.0-0');
  }

  unFormatValue() {
    if (typeof this.decimalMarker === 'undefined') {
      const symbols = formatNumber(1000.99, 'en').replace(/\d/g, '');
      [, this.decimalMarker] = symbols.split('');
    }

    const value = this.displayValue;
    if (typeof value === 'undefined' || this.isLastCharacterDecimalSeparator(value)) {
      return;
    }
    const regExp = new RegExp(`[^\\d${this.decimalMarker}-]`, 'g');
    const [integer, decimal] = value.replace(regExp, '').split(this.decimalMarker);

    this.displayValue = integer + (this.float ? '.' + decimal : '');
  }

  errors(): ValidationErrors | null {
    return this.input.errors;
  }
}

type NumberFieldErrorMessages = 'required' | 'min';
