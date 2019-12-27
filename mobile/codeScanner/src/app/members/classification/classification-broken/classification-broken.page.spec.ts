import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationBrokenPage } from './classification-broken.page';

describe('ClassificationBrokenPage', () => {
  let component: ClassificationBrokenPage;
  let fixture: ComponentFixture<ClassificationBrokenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationBrokenPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationBrokenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
