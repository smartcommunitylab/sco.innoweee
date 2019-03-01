import { TestBed } from '@angular/core/testing';

import { GarbageCollectionService } from './garbage-collection.service';

describe('GarbageCollectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GarbageCollectionService = TestBed.get(GarbageCollectionService);
    expect(service).toBeTruthy();
  });
});
