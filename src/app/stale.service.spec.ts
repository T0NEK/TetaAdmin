/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StaleService } from './stale.service';

describe('Service: Polaczenia', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaleService]
    });
  });

  it('should ...', inject([StaleService], (service: StaleService) => {
    expect(service).toBeTruthy();
  }));
});
