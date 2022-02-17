import { TestBed } from '@angular/core/testing';

import { NgCommonsService } from './ng-commons.service';

describe('NgCommonsService', () => {
  let service: NgCommonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgCommonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
