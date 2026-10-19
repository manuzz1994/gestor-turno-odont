import { TestBed } from '@angular/core/testing';
import { PacienteApi } from './paciente-api';

describe('PacienteApi', () => {
  let service: PacienteApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PacienteApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
