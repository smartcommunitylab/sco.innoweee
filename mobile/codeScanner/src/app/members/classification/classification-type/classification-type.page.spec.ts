import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationTypePage } from './classification-type.page';

describe('ClassificationTypePage', () => {
  let component: ClassificationTypePage;
  let fixture: ComponentFixture<ClassificationTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationTypePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
