import { TestBed } from '@angular/core/testing';

import { ErrorBoxService } from './error-box.service';

describe('ErrorBoxService', () => {
  let service: ErrorBoxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorBoxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
