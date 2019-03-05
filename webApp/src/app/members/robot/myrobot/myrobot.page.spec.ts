import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyrobotPage } from './myrobot.page';

describe('MyrobotPage', () => {
  let component: MyrobotPage;
  let fixture: ComponentFixture<MyrobotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyrobotPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyrobotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
