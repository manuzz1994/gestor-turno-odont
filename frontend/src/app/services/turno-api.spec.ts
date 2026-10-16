import { TestBed } from '@angular/core/testing';
import { TurnoApi } from './turno-api';

describe('TurnoApi', () => {
  let service: TurnoApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurnoApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
