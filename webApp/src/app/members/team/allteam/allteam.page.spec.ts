import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllteamPage } from './allteam.page';

describe('AllteamPage', () => {
  let component: AllteamPage;
  let fixture: ComponentFixture<AllteamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllteamPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllteamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
