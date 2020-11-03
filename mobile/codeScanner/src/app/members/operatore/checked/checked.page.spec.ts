import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedPage } from './checked.page';

describe('CheckedPage', () => {
  let component: CheckedPage;
  let fixture: ComponentFixture<CheckedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
