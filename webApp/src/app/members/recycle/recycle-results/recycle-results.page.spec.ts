import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecycleResultsPage } from './recycle-results.page';

describe('RecycleResultsPage', () => {
  let component: RecycleResultsPage;
  let fixture: ComponentFixture<RecycleResultsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecycleResultsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecycleResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
