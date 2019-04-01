import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRecognizedPage } from './item-recognized.page';

describe('ItemRecognizedPage', () => {
  let component: ItemRecognizedPage;
  let fixture: ComponentFixture<ItemRecognizedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemRecognizedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRecognizedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
