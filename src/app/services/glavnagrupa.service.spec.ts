import { TestBed } from '@angular/core/testing';

import { GlavnagrupaService } from './glavnagrupa.service';

describe('GlavnagrupaService', () => {
  let service: GlavnagrupaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlavnagrupaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
