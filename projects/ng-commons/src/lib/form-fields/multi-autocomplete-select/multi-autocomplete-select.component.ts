import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter, forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {NG_VALUE_ACCESSOR, NgModel, ValidationErrors} from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {BaseInputField} from '../base/BaseInputField';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-multi-autocomplete-select',
  templateUrl: './multi-autocomplete-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiAutocompleteSelectComponent),
      multi: true,
    },
    {
      provide: 'app-input-field',
      useExisting: MultiAutocompleteSelectComponent
    }
  ]
})
export class MultiAutocompleteSelectComponent implements BaseInputField, OnDestroy, OnInit, AfterViewInit {
  @Input() availableValues: string[] = [];
  @Input() value: string[] = [];
  @Input() placeholder?: string;
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() name = '';
  @Input() required = false;
  @Input() maxCount = 0;
  @Input() minCount = 0;
  @Input() icon?: IconProp;
  @Input() iconPositionPrefix = true;
  @Input() showError = true;
  @Input() disabled = false;
  initialized = false;

  //@ts-ignore
  @ViewChild('fruitInput') nativeInput: ElementRef<HTMLInputElement>;
  //@ts-ignore
  @ViewChild(NgModel) input: NgModel = null;
  internalModelValue = '';
  filteredItems: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @Input() errorMessages: {[key in MultiSelectErrorMessages]?: string} = {};

  constructor() {}

  ngOnInit(): void {
    if (typeof this.value !== 'undefined' && this.value !== null) {
      this.filteredItems = this.availableValues.map(x => x.toLowerCase())
        .filter(x => this.value.map(y => y.toLowerCase()).indexOf(x) === -1);
    }
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
    if (typeof this.value !== 'undefined' && this.value !== null) {
      this.filteredItems = this.availableValues.map(x => x.toLowerCase())
        .filter(x => this.value.map(y => y.toLowerCase()).indexOf(x) === -1);
    }
  }

  internalChangeValue(obj: any): void {
    this.value = obj;
    this.propagateChange(this.value);
  }

  markAsTouched(): void {
    this.input.control.markAsTouched();
  }

  valid(): boolean {
    return this.input.valid ?? false;
  }

  errors(): ValidationErrors | null {
    return this.input.errors;
  }

  ngAfterViewInit(): void {
    this.initialized = true;
  }

  remove(label: string) {
    const index = this.value.indexOf(label);
    if (index >= 0) {
      this.value.splice(index, 1);
      this.propagateChange(this.value);
      this.filteredItems.push(label);
    }
  }

  addLabel($event: MatChipInputEvent) {
    const input = $event.input;
    const value = $event.value;
    if ((value || '').trim()) {
      this.value.push(value.trim());
      this.propagateChange(this.value);
    }
    if (input) {
      this.nativeInput.nativeElement.value = '';
    }
  }

  selectedLabel(event: MatAutocompleteSelectedEvent): void {
    this.nativeInput.nativeElement.value = '';
    this.value.push(event.option.viewValue);
    this.propagateChange(this.value);
    this.inputChange(null);
  }

  inputChange(item: string | null): void {
    if (item !== null) {
      this.filteredItems = this.availableValues
        .filter(x => this.value.map(y => y.toLowerCase()).indexOf(x) === -1)
        .filter(x => x.toLowerCase().indexOf(item.toLowerCase()) === 0);
    } else {
      this.filteredItems = this.availableValues.map(x => x.toLowerCase())
        .filter(x => this.value.map(y => y.toLowerCase()).indexOf(x) === -1);
    }
  }
}

type MultiSelectErrorMessages = 'required';
