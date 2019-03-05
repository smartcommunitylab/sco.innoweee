import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSelectionPage } from './game-selection.page';

describe('GameSelectionPage', () => {
  let component: GameSelectionPage;
  let fixture: ComponentFixture<GameSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameSelectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
