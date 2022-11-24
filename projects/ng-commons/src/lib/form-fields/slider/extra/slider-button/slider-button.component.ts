import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'commons-slider-button',
  templateUrl: './slider-button.component.html',
  styleUrls: ['./slider-button.component.scss']
})
export class SliderButtonComponent implements OnInit {
  @Input() classText = '';
  @Input() disabled = false;
  @Input() title = '';
  @Input() icon?: IconProp = undefined;
  @Output() onClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
