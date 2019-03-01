import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemLoadedPage } from './item-loaded.page';

describe('ItemLoadedPage', () => {
  let component: ItemLoadedPage;
  let fixture: ComponentFixture<ItemLoadedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemLoadedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemLoadedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
