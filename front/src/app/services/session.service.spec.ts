import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

import { SessionService } from './session.service';
import { lastValueFrom } from 'rxjs';


describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
        // THEN

    expect(service).toBeTruthy();
  });

  it('should logout', () => {

    // WHEN
    service.logOut();

    // THEN
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBe(undefined);
    expect(lastValueFrom(service.$isLogged())).resolves.toBe(false);
  });

  it('should login', () => {
    // GIVEN
    const sessionInfo = {
      admin: true,
      token: 'token',
      id: 1,
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastName',
      type: 'type',
    };

    // WHEN
    service.logIn(sessionInfo);

    // THEN
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(sessionInfo);
    expect(lastValueFrom(service.$isLogged())).resolves.toBe(true);
});
});
