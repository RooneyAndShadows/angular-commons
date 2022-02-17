import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCommonsComponent } from './ng-commons.component';

describe('NgCommonsComponent', () => {
  let component: NgCommonsComponent;
  let fixture: ComponentFixture<NgCommonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgCommonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgCommonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
