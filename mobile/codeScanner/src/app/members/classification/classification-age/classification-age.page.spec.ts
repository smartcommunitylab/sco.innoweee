import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificationAgePage } from './classification-age.page';

describe('ClassificationAgePage', () => {
  let component: ClassificationAgePage;
  let fixture: ComponentFixture<ClassificationAgePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassificationAgePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationAgePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
