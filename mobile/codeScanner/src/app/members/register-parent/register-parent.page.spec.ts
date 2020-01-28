import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterParentPage } from './register-parent.page';

describe('RegisterParentPage', () => {
  let component: RegisterParentPage;
  let fixture: ComponentFixture<RegisterParentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterParentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterParentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
