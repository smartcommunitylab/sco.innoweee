import { TestBed } from '@angular/core/testing';

import { Game.ServiceService } from './game.service.service';

describe('Game.ServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Game.ServiceService = TestBed.get(Game.ServiceService);
    expect(service).toBeTruthy();
  });
});
