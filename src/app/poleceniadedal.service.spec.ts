/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PoleceniadedalService } from './poleceniadedal.service';

describe('Service: Poleceniadedal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoleceniadedalService]
    });
  });

  it('should ...', inject([PoleceniadedalService], (service: PoleceniadedalService) => {
    expect(service).toBeTruthy();
  }));
});
