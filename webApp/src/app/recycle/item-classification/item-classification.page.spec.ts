import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemClassificationPage } from './item-classification.page';

describe('ItemClassificationPage', () => {
  let component: ItemClassificationPage;
  let fixture: ComponentFixture<ItemClassificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemClassificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemClassificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
