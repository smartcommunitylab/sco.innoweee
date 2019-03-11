import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectClassPage } from './select-class.page';

describe('SelectClassPage', () => {
  let component: SelectClassPage;
  let fixture: ComponentFixture<SelectClassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectClassPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectClassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
