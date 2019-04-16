import { TestBed } from '@angular/core/testing';

import { FaturasService } from './faturas.service';

describe('FaturasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FaturasService = TestBed.get(FaturasService);
    expect(service).toBeTruthy();
  });
});
