import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemConfirmPage } from './item-confirm.page';

describe('ItemConfirmPage', () => {
  let component: ItemConfirmPage;
  let fixture: ComponentFixture<ItemConfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemConfirmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
