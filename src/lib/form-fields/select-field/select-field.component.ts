import {Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR, NgModel, ValidationErrors, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {BaseInputField} from '../base/BaseInputField';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {MatFormFieldAppearance} from "@angular/material/form-field";

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectFieldComponent),
      multi: true,
    },
    {
      provide: 'app-input-field',
      useExisting: SelectFieldComponent
    }
  ]
})
export class SelectFieldComponent implements BaseInputField, OnDestroy, OnInit {
  @Input() allowedValues: SelectElement[] = [];
  @Input() placeholder: string = '';
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() name = '';
  @Input() required = false;
  @Input() icon?: IconProp;
  @Input() iconPositionPrefix = true;
  @Input() disabled = false;
  @Input() value: string = '';
  @Input() showError = true;

  @Input() errorMessages: {[key in SelectErrorMessages]?: string} = {};
  @Input() appearance: MatFormFieldAppearance = 'fill'
  initialized = false;

  public groupedValues: {[index: string]: SelectElement[]} = {};
  public groupedValuesKeys: string[] = [];
  private pendingValue?: any;

  @ViewChild(NgModel) selectbox!: NgModel;

  propagateChange = (_: any) => {};
  propagateTouch = (_: any) => {};

  constructor() {}

  ngOnDestroy() {

  }

  setDisabled(value: boolean): void {
    this.disabled = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  writeValue(obj: any): void {
    this.pendingValue = obj;
    this.commitPendingValue();
  }

  internalChangeValue(obj: any): void {
    this.pendingValue = obj;
    this.commitPendingValue();
    this.propagateChange(this.value);
  }

  private commitPendingValue() {
    if (typeof this.pendingValue === 'undefined' || this.pendingValue === null || this.allowedValues.map(x => x.value.toString()).indexOf(this.pendingValue.toString()) > -1) {
      this.value = this.pendingValue;
    }
    this.pendingValue = '';
  }

  markAsTouched(): void {
    this.selectbox.control.markAsTouched();
  }

  valid(): boolean {
    return this.selectbox.valid ?? false;
  }

  errors(): ValidationErrors | null {
    return this.selectbox.errors ?? null;
  }

  ngOnInit(): void {
    this.allowedValues = this.allowedValues.map(value1 => {
      return {value: value1.value.toString(), title: value1.title, group: value1.group};
    });
    this.allowedValues.forEach(value => {
      const groupKey = value.group ?? '';
      if (this.groupedValuesKeys.filter(x => x === groupKey).length === 0) {
        this.groupedValuesKeys.push(groupKey);
      }
      if (typeof this.groupedValues[groupKey] === "undefined") {
        this.groupedValues[groupKey] = [];
      }
      this.groupedValues[groupKey].push(value);
    });
    if (this.value !== this.pendingValue)
      this.commitPendingValue();
  }

  ngAfterViewInit(): void {
    this.initialized = true;
  }

  touchEnded() {
    this.propagateTouch(this.value);
  }
}

export class SelectElement {
  public value: string = '';
  public readonly title: string = '';
  public group?: string = undefined;
}

type SelectErrorMessages = 'required';
