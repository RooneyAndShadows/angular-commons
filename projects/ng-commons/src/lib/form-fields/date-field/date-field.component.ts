import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

// @ts-ignore
import moment from 'moment';
import {NG_VALUE_ACCESSOR, NgModel, ValidationErrors} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {BaseInputField} from '../base/BaseInputField';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD MMMM, YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateFieldComponent),
      multi: true,
    },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    {
      provide: 'app-input-field',
      useExisting: DateFieldComponent
    }
  ]
})
export class DateFieldComponent implements BaseInputField, OnDestroy, OnInit, AfterViewInit {
  @Input() value?: string;
  @Input() placeholder: string = '';
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() name = '';
  @Input() required = false;
  @Input() icon?: IconProp;
  @Input() iconPositionPrefix = true;
  @Input() showError = true;
  @Input() disabled = false;

  @Input() errorMessages: {[key in DateBoxErrorMessages]?: string} = {};

  initialized = false;
  dateValue = moment();

  // @ts-ignore
  @ViewChild(NgModel) input: NgModel = null;

  constructor() {}

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  setDisabled(value: boolean): void {
    this.disabled = value;
  }

  propagateChange = (_: any) => {};
  propagateTouch = (_: any) => {};

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  writeValue(obj: any): void {
      this.value = obj;
      if (typeof obj !== 'undefined' && obj !== null) {
        this.dateValue = moment(obj, 'YYYY-MM-DD HH:mm:ss');
      } else {
        this.value = this.dateValue.format('YYYY-MM-DD HH:mm:ss');
        this.propagateChange(this.value);
      }
  }

  internalChangeValue(obj: any): void {
    this.value = obj;
    if (typeof obj !== 'undefined' && obj !== null) {
      this.dateValue = moment(moment(obj).format('YYYY-MM-DD') + ' ' + this.dateValue.format('HH:mm'), 'YYYY-MM-DD HH:mm');
    }
    this.propagateChange(this.value);
  }

  markAsTouched(): void {
    this.input.control.markAsTouched();
  }

  valid(): boolean {
    return this.input.valid ?? false;
  }

  ngAfterViewInit(): void {
    this.initialized = true;
  }

  errors(): ValidationErrors | null {
    return this.input.errors;
  }
}

type DateBoxErrorMessages = 'required';
