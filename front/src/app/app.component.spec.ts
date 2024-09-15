import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;
  let zone: NgZone;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [AppComponent],
      providers: [AuthService, SessionService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    zone = TestBed.inject(NgZone);
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should call $isLogged() and return true', () => {
    // Arrange
    const isLoggedSpy = jest.spyOn(sessionService, '$isLogged').mockReturnValue(of(true));

    // Act
    const result: Observable<boolean> = app.$isLogged();

    // Assert
    result.subscribe((value) => {
      expect(value).toBe(true);
      expect(isLoggedSpy).toHaveBeenCalled();
    });
  });

  it('should call $isLogged() and return false', () => {
    // Arrange
    const isLoggedSpy = jest.spyOn(sessionService, '$isLogged').mockReturnValue(of(false));

    // Act
    const result: Observable<boolean> = app.$isLogged();

    // Assert
    result.subscribe((value) => {
      expect(value).toBe(false);
      expect(isLoggedSpy).toHaveBeenCalled();
    });
  });

  it('should call logout() and navigate to home', () => {
    // Arrange
    const logOutSpy = jest.spyOn(sessionService, 'logOut');
    const navigateSpy = jest.spyOn(router, 'navigate');
    const runSpy = jest.spyOn(zone, 'run');

    // Act
    app.logout();

    // Assert
    expect(logOutSpy).toHaveBeenCalled();
    expect(runSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });

  it('should call logout() and handle navigation correctly in NgZone', () => {
    // Arrange
    const logOutSpy = jest.spyOn(sessionService, 'logOut');
    const navigateSpy = jest.spyOn(router, 'navigate');
    const runSpy = jest.spyOn(zone, 'run').mockImplementation((fn: Function) => fn());

    // Act
    app.logout();

    // Assert
    expect(logOutSpy).toHaveBeenCalled();
    expect(runSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });
});
