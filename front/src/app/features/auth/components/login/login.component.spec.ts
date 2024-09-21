import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs'; // Importation pour gérer les observables et les erreurs
import { SessionService } from 'src/app/services/session.service';

import { AuthService } from '../../services/auth.service'; // Importation du service d'authentification
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface'; // Importation de l'interface pour la session

import { LoginComponent } from './login.component';
import { Router } from '@angular/router'; // Importation pour la simulation de navigation

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router; // Déclaration pour Router
  let sessionService: SessionService; // Déclaration pour SessionService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule, // Pour tester la navigation sans navigation réelle
        BrowserAnimationsModule, // Pour les animations Angular Material
        HttpClientModule, // Pour les appels HTTP
        MatCardModule, // Composant Material Card
        MatIconModule, // Composant Material Icon
        MatFormFieldModule, // Composant Material Form Field
        MatInputModule, // Composant Material Input
        ReactiveFormsModule, // Pour les formulaires réactifs
      ],
    }).compileComponents();

    sessionService = TestBed.inject(SessionService); // Injection du SessionService
    router = TestBed.inject(Router); // Injection du Router
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Vérifie que le composant est créé avec succès
  });

  it('should have a login form with email, password, and a disabled submit button', () => {
    const form = fixture.nativeElement;
    const email = form.querySelector('input[formControlName="email"]');
    const password = form.querySelector('input[formControlName="password"]');
    const submitButton = form.querySelector('button[type="submit"]');

    expect(email).toBeTruthy(); // Vérifie que le champ email existe
    expect(password).toBeTruthy(); // Vérifie que le champ password existe
    expect(submitButton).toBeTruthy(); // Vérifie que le bouton de soumission existe
    expect(submitButton.disabled).toBe(true); // Vérifie que le bouton est désactivé par défaut
  });

  it('should be invalid if empty after focus and blur', () => {
    const form = fixture.nativeElement;
    const email = form.querySelector('input[formControlName="email"]');
    const password = form.querySelector('input[formControlName="password"]');

    email.focus();
    email.blur(); // Simule le focus et le blur pour le champ email

    password.focus();
    password.blur(); // Simule le focus et le blur pour le champ password

    expect(email.classList).toContain('ng-invalid'); // Vérifie que le champ email est invalide
    expect(password.classList).toContain('ng-invalid'); // Vérifie que le champ password est invalide
  });

  it('should contain valid class with valid email and password', () => {
    const form = fixture.nativeElement;
    const email = form.querySelector('input[formControlName="email"]');
    const password = form.querySelector('input[formControlName="password"]');

    email.focus();
    email.blur();
    password.focus();
    password.blur();

    email.value = 'mail@test.com';
    email.dispatchEvent(new Event('input')); // Remplit le champ email et déclenche l'événement input
    password.value = 'password';
    password.dispatchEvent(new Event('input')); // Remplit le champ password et déclenche l'événement input

    fixture.detectChanges();

    expect(email.value).toBe('mail@test.com'); // Vérifie que la valeur du champ email est correcte
    expect(email.classList).toContain('ng-valid'); // Vérifie que le champ email est valide
    expect(password.value).toBe('password'); // Vérifie que la valeur du champ password est correcte
    expect(password.classList).toContain('ng-valid'); // Vérifie que le champ password est valide
  });

  it('should enable the submit button with valid email and password', () => {
    const form = fixture.nativeElement;
    const submitButton = form.querySelector('button[type="submit"]');
    const email = form.querySelector('input[formControlName="email"]');

    email.value = 'mail@test.com';
    email.dispatchEvent(new Event('input'));

    const password = form.querySelector('input[formControlName="password"]');
    password.value = 'password';
    password.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(submitButton.disabled).toBe(false); // Vérifie que le bouton de soumission est activé avec des valeurs valides
  });

  it('should show an error message', () => {
    component.onError = true; // Simule une erreur dans le composant
    fixture.detectChanges(); // Force la mise à jour du DOM
  
    const form = fixture.nativeElement; // Récupère l'élément HTML du formulaire
    const errorMessage = form.querySelector('p.error'); // Cherche l'élément HTML contenant le message d'erreur
    expect(errorMessage).toBeTruthy(); // Vérifie que le message d'erreur est présent dans le DOM
    expect(errorMessage!.textContent).toContain('An error occurred'); // Vérifie que le texte du message d'erreur contient bien "An error occurred"
  });
  

  it('should indicate error', () => {
    const authService = TestBed.inject(AuthService); // Injection du AuthService
    const loginSpy = jest.spyOn(authService, 'login').mockImplementation(() => throwError(() => new Error('err'))); // Simulation d'une erreur de connexion

    component.submit(); // Appelle la méthode submit du composant

    expect(loginSpy).toHaveBeenCalled(); // Vérifie que la méthode login a été appelée
    expect(component.onError).toBe(true); // Vérifie que l'indicateur d'erreur est activé
  });

  it('should navigate to the sessions page', () => {
    const authService = TestBed.inject(AuthService); // Injection du AuthService
    const authSpy = jest.spyOn(authService, 'login').mockImplementation(() => of({} as SessionInformation)); // Simulation d'une connexion réussie

    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(async () => true); // Simulation de la navigation

    component.submit(); // Appelle la méthode submit du composant

    expect(authSpy).toHaveBeenCalled(); // Vérifie que la méthode login a été appelée
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']); // Vérifie que la navigation a été effectuée vers la page des sessions
  });
});
