import {
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter, forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output, QueryList,
  ViewChild
} from '@angular/core';
import {BaseInputField} from "../base/BaseInputField";
import {MatFormFieldAppearance} from "@angular/material/form-field/form-field";
import {NG_VALUE_ACCESSOR, NgModel, ValidationErrors} from "@angular/forms";
import {SliderButtonComponent} from "./extra/slider-button/slider-button.component";

@Component({
  selector: 'commons-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
    {
      provide: 'commons-slider',
      useExisting: SliderComponent
    }
  ]
})
export class SliderComponent implements BaseInputField, OnDestroy, OnInit, AfterViewInit {
  @Input() value: any = 0;
  @Input() placeholder: string = '';
  @Input() name = '';
  @Input() disabled = false;
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() valueLabelFormatter: (value: any) => string = (val: any) => val.toString()

  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
  initialized = false;

  @ContentChildren(SliderButtonComponent) buttons!: QueryList<SliderButtonComponent>;

  constructor() {}

  setDisabled(value: boolean): void {
    this.disabled = value;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
    if (typeof this.value === "number" && this.value < this.min) {
      this.value = this.min;
    }
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

  }

  valid(): boolean {
    return true
  }

  ngAfterViewInit(): void {
    this.initialized = true;
  }

  errors(): ValidationErrors | null {
    return {};
  }
}
