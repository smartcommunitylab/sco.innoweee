import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertNewPage } from './insert-new.page';

describe('InsertNewPage', () => {
  let component: InsertNewPage;
  let fixture: ComponentFixture<InsertNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
