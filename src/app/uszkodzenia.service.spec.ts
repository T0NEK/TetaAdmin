/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UszkodzeniaService } from './uszkodzenia.service';

describe('Service: Uszkodzenia', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UszkodzeniaService]
    });
  });

  it('should ...', inject([UszkodzeniaService], (service: UszkodzeniaService) => {
    expect(service).toBeTruthy();
  }));
});
