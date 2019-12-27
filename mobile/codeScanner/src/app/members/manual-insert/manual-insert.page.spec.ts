import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualInsertPage } from './manual-insert.page';

describe('ManualInsertPage', () => {
  let component: ManualInsertPage;
  let fixture: ComponentFixture<ManualInsertPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualInsertPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualInsertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
