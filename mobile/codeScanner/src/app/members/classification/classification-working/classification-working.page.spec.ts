import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationWorkingPage } from './classification-working.page';

describe('ClassificationWorkingPage', () => {
  let component: ClassificationWorkingPage;
  let fixture: ComponentFixture<ClassificationWorkingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationWorkingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationWorkingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
