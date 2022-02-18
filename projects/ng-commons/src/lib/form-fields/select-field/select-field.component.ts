import {Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR, ValidationErrors, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {BaseInputField} from '../base/BaseInputField';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

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
  @Input() value?: string;
  @Input() placeholder: string = '';
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() name = '';
  @Input() required = false;
  @Input() icon?: IconProp;
  @Input() iconPositionPrefix = true;
  @Input() disabled = false;

  @Input() errorMessages: {[key in SelectErrorMessages]?: string} = {};

  selected?: FormControl = undefined;
  changeSubscription?: Subscription;

  propagateChange = (_: any) => {};
  propagateTouch = (_: any) => {};

  constructor() {}

  ngOnDestroy() {
    this.changeSubscription?.unsubscribe();
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
    if (typeof obj === 'undefined' || obj === null || this.allowedValues.map(x => x.value.toString()).indexOf(obj.toString()) > -1) {
      this.value = obj;
      this.selected?.setValue(obj?.toString());
    }
  }

  markAsTouched(): void {
    this.selected?.markAsTouched();
  }

  valid(): boolean {
    return this.selected?.valid ?? false;
  }

  errors(): ValidationErrors | null {
    return this.selected?.errors ?? null;
  }

  ngOnInit(): void {
    this.allowedValues = this.allowedValues.map(value1 => {
      return {value: value1.value.toString(), title: value1.title};
    });
    this.selected = new FormControl(undefined, this.required ? [
      Validators.required,
    ] : []);
    this.changeSubscription = this.selected.valueChanges.subscribe(value1 => {
      this.value = value1;
      this.propagateChange(this.value);
    });
  }
}

export class SelectElement {
  public value: string = '';
  public readonly title: string = '';
}

type SelectErrorMessages = 'required';
