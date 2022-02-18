import {Component, Input, OnInit} from '@angular/core';
import {LocaleStringsService} from '../../services/LocaleStringsService';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html'
})
export class LoadingComponent implements OnInit {
  @Input() text?: string;
  constructor(private strings: LocaleStringsService) { }

  ngOnInit() {
    if (this.text === undefined)
      this.text = this.strings.getStringOrDefault('system_please_wait_phrase', 'Please, wait while we execute your request...')
  }

}
