import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemClassifiedPage } from './item-classified.page';

describe('ItemClassifiedPage', () => {
  let component: ItemClassifiedPage;
  let fixture: ComponentFixture<ItemClassifiedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemClassifiedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemClassifiedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
