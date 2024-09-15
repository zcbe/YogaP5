import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';  // Permet la simulation de la navigation dans les tests
import { of } from 'rxjs';  // Utilisé pour simuler les observables retournés par les services
import { UserService } from '../../services/user.service';  // Simule les interactions avec le service utilisateur
import { User } from '../../interfaces/user.interface';  // Définit un utilisateur mocké utilisé dans les tests


import { MeComponent } from './me.component';
import { MatInputModule } from '@angular/material/input';
import { SessionService } from 'src/app/services/session.service';

describe('MeComponent', () => {
  let component: MeComponent;  // Instance du composant à tester
  let fixture: ComponentFixture<MeComponent>;  // Instance de Fixture pour manipuler le composant dans les tests
  let mockRouter: Partial<Router>;  // Simule le service Router
  let mockSnackBar: MatSnackBar;  // Simule le service MatSnackBar
  let mockUserService: Partial<UserService>;  // Simule le service UserService
  let mockSessionService: Partial<SessionService>;  // Simule le service SessionService

    // Définit un utilisateur mocké pour les tests

  const mockUser: User = {
    id: 1,
    email: 'yoga@example.com',
    lastName: 'YOGA', 
    firstName: 'Yoga',
    admin: true,
    password: 'MockedPassword',
    createdAt: new Date(), 
  };

  beforeEach(async () => {
        // Initialisation des mocks avec des méthodes spécifiques

    mockRouter = {
      navigate: jest.fn(), // Simule la méthode navigate du Router
    };

    mockSnackBar = {
      open: jest.fn(),// Simule la méthode open du MatSnackBar
    } as unknown as MatSnackBar; // Conversion du type pour correspondre à MatSnackBar


    mockUserService = {
      getById: jest.fn().mockReturnValue(of(mockUser)),  // Simule la méthode getById du UserService pour retourner un utilisateur mocké
      delete: jest.fn().mockReturnValue(of({})),  // Simule la méthode delete du UserService pour retourner une réponse vide
    };

    mockSessionService = {
      sessionInformation: {
        token: 'thisIsAMockedToken',
        type: 'session',
        id: 1,
        username: 'yoga@example.com',
        lastName: 'YOGA', 
        firstName: 'Yoga',
        admin: true,
      },
      logOut: jest.fn(),   // Simule la méthode logOut du SessionService
    };

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },  // Fournit le mock Router aux tests
        { provide: MatSnackBar, useValue: mockSnackBar },  // Fournit le mock MatSnackBar aux tests
        { provide: UserService, useValue: mockUserService },  // Fournit le mock UserService aux tests
        { provide: SessionService, useValue: mockSessionService },  // Fournit le mock SessionService aux tests
      ],
    }).compileComponents();  // Compilation des composants pour les tests

    fixture = TestBed.createComponent(MeComponent);  // Création de l'instance du composant à tester
    component = fixture.componentInstance;  // Attribution du composant à la variable
    fixture.detectChanges();  // Détection des changements dans le composant
  });

  // Vérifie que le composant est créé avec succès
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Vérifie que la méthode ngOnInit appelle UserService.getById et initialise l'utilisateur
  it('should call ngOnInit and set user', () => {
    const userServiceSpy = jest.spyOn(mockUserService, 'getById');  // Spy sur la méthode getById

    component.ngOnInit();  // Appel de ngOnInit du composant

    expect(userServiceSpy).toHaveBeenCalledWith('1');  // Vérifie que getById a été appelé avec '1'
    expect(component.user).toEqual(mockUser);  // Vérifie que l'utilisateur du composant est correctement initialisé
  });

  // Vérifie que la méthode back appelle window.history.back
  it('should call back and navigate back in history', () => {
    const historyBackSpy = jest.spyOn(window.history, 'back');  // Spy sur la méthode history.back

    component.back();  // Appel de la méthode back du composant

    expect(historyBackSpy).toHaveBeenCalled();  // Vérifie que history.back a été appelé
  });

  // Vérifie que la méthode delete appelle les méthodes appropriées et effectue les actions nécessaires
  it('should call delete and perform necessary actions', () => {
    const userServiceDeleteSpy = jest.spyOn(mockUserService, 'delete');  // Spy sur la méthode delete
    const logOutSpy = jest.spyOn(mockSessionService, 'logOut');  // Spy sur la méthode logOut
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');  // Spy sur la méthode navigate
    const snackBarOpenSpy = jest.spyOn(mockSnackBar, 'open');  // Spy sur la méthode open

    component.delete();  // Appel de la méthode delete du composant

    expect(userServiceDeleteSpy).toHaveBeenCalledWith('1');  // Vérifie que delete a été appelé avec '1'
    expect(logOutSpy).toHaveBeenCalled();  // Vérifie que logOut a été appelé
    expect(navigateSpy).toHaveBeenCalledWith(['/']);  // Vérifie que navigate a été appelé pour rediriger vers '/'
    expect(snackBarOpenSpy).toHaveBeenCalledWith('Your account has been deleted !', 'Close', {
      duration: 3000,
    });  // Vérifie que open a été appelé avec le message et les options attendus
  });
});
