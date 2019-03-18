import { TestBed } from '@angular/core/testing';

import { DataServerService } from './data.service';

describe('DataServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataServerService = TestBed.get(DataServerService);
    expect(service).toBeTruthy();
  });
});
