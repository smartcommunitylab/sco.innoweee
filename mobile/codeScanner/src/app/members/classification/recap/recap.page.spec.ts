import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapPage } from './recap.page';

describe('RecapPage', () => {
  let component: RecapPage;
  let fixture: ComponentFixture<RecapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
