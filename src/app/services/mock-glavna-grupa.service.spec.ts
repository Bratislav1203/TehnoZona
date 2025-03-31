import { TestBed } from '@angular/core/testing';

import { MockGlavnaGrupaService } from './mock-glavna-grupa.service';

describe('MockGlavnaGrupaService', () => {
  let service: MockGlavnaGrupaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockGlavnaGrupaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
