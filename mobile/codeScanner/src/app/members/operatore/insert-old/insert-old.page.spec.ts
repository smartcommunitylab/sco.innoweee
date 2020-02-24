import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertOldPage } from './insert-old.page';

describe('InsertOldPage', () => {
  let component: InsertOldPage;
  let fixture: ComponentFixture<InsertOldPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertOldPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertOldPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
