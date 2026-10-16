import { TestBed } from '@angular/core/testing';
import { SesionDoctor } from './sesion-doctor';

describe('SesionDoctor', () => {
  let service: SesionDoctor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SesionDoctor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
