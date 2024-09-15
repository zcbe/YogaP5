import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';  // Importation de fonctions pour simuler les réponses d'observables
import { RegisterComponent } from './register.component';  // Le composant à tester
import { AuthService } from '../../services/auth.service'; // Service d'authentification utilisé dans le composant
import { Router } from '@angular/router';  // Service de routage utilisé pour la navigation

describe('RegisterComponent', () => {
  let component: RegisterComponent;  // Référence au composant
  let fixture: ComponentFixture<RegisterComponent>;  // Conteneur pour accéder au DOM et au composant dans les tests
  let router: Router;  // Référence au service de routage pour simuler la navigation
  let authService: AuthService;  // Référence au service d'authentification pour simuler les appels de service

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],  // Déclare le composant à tester
      providers: [AuthService],  // Injection du service d'authentification dans le test
      imports: [
        RouterTestingModule,  // Simule le module de routage pour les tests
        BrowserAnimationsModule,
        HttpClientModule,  // Importation pour gérer les appels HTTP (si présents dans le composant)
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,  // Nécessaire pour gérer les formulaires réactifs dans Angular
      ],
    }).compileComponents();  // Compile les composants et modules pour les rendre prêts à être testés

    authService = TestBed.inject(AuthService);  // Injection du service d'authentification dans la variable authService
    router = TestBed.inject(Router);  // Injection du service de routage dans la variable router
    fixture = TestBed.createComponent(RegisterComponent);  // Création d'une instance du composant
    component = fixture.componentInstance;  // Récupération de l'instance du composant
    fixture.detectChanges();  // Déclenche la détection de changement pour que le DOM soit mis à jour
  });

  // Vérifie que le composant est créé correctement
  it('should create', () => {
    expect(component).toBeTruthy();  // Vérifie que le composant a été initialisé sans erreur
  });

  // Test pour vérifier la structure du formulaire et la présence des champs
  it('should have a register form with email, first name, last name, password, and a disabled submit button', () => {
    const form = fixture.nativeElement;  // Récupère le DOM du formulaire
    const email = form.querySelector('input[formControlName="email"]');  // Sélectionne le champ email
    const firstName = form.querySelector('input[formControlName="firstName"]');  // Sélectionne le champ prénom
    const lastName = form.querySelector('input[formControlName="lastName"]');  // Sélectionne le champ nom
    const password = form.querySelector('input[formControlName="password"]');  // Sélectionne le champ mot de passe
    const submitButton = form.querySelector('button[type="submit"]');  // Sélectionne le bouton de soumission

    // Vérifie que tous les champs et le bouton existent dans le formulaire et que le bouton est désactivé par défaut
    expect(email).toBeTruthy();
    expect(firstName).toBeTruthy();
    expect(lastName).toBeTruthy();
    expect(password).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(submitButton.disabled).toBe(true);
  });

  // Test pour vérifier que les champs du formulaire sont marqués comme invalides s'ils sont vides après un focus/blocage
  it('should mark form controls as invalid if empty after focus and blur', () => {
    const form = fixture.nativeElement;

    // Sélectionne les champs et déclenche les événements de focus et blur
    const email = form.querySelector('input[formControlName="email"]');
    const firstName = form.querySelector('input[formControlName="firstName"]');
    const lastName = form.querySelector('input[formControlName="lastName"]');
    const password = form.querySelector('input[formControlName="password"]');

    [email, firstName, lastName, password].forEach((control) => {
      control.focus();  // Simule le focus sur le champ
      control.blur();  // Simule le blur sur le champ (perte de focus)
      expect(control.classList).toContain('ng-invalid');  // Vérifie que le champ est marqué comme invalide
    });
  });

  // Test pour vérifier que le bouton de soumission est activé lorsque tous les champs sont valides
  it('should enable the submit button with valid form', () => {
    const form = fixture.nativeElement;
    const submitButton = form.querySelector('button[type="submit"]');
    const email = form.querySelector('input[formControlName="email"]');
    const firstName = form.querySelector('input[formControlName="firstName"]');
    const lastName = form.querySelector('input[formControlName="lastName"]');
    const password = form.querySelector('input[formControlName="password"]');

    // Simule la saisie de valeurs valides dans tous les champs
    email.value = 'mail@test.com';
    email.dispatchEvent(new Event('input'));
    firstName.value = 'Test';
    firstName.dispatchEvent(new Event('input'));
    lastName.value = 'TEST';
    lastName.dispatchEvent(new Event('input'));
    password.value = 'password';
    password.dispatchEvent(new Event('input'));

    fixture.detectChanges();  // Met à jour le DOM après les changements

    // Vérifie que tous les champs sont valides et que le bouton de soumission est activé
    expect(email.classList).toContain('ng-valid');
    expect(firstName.classList).toContain('ng-valid');
    expect(lastName.classList).toContain('ng-valid');
    expect(password.classList).toContain('ng-valid');
    expect(submitButton.disabled).toBe(false);
  });

  // Test pour vérifier l'affichage d'un message d'erreur en cas d'erreur dans le formulaire
  it('should show an error when there is an error', () => {
    component.onError = true;  // Simule une erreur dans le composant
    fixture.detectChanges();  // Met à jour le DOM pour refléter l'état de l'erreur

    const form = fixture.nativeElement;
    const errorMessage = form.querySelector('span.error');  // Sélectionne le message d'erreur

    // Vérifie que le message d'erreur est bien affiché
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('An error occurred');
  });

  // Test pour vérifier que les champs sont invalides si le formulaire est vide et soumis
  it('should show an error when the form is empty', () => {
    const form = fixture.nativeElement;
    const submitButton = form.querySelector('button[type="submit"]');

    // Simule le clic sur le bouton de soumission lorsque le formulaire est vide
    submitButton.click();
    fixture.detectChanges();

    // Vérifie que tous les champs sont marqués comme invalides
    expect(form.querySelectorAll('input.ng-invalid')).toHaveLength(4);
  });

  // Test pour vérifier que le composant gère correctement les erreurs lors de l'enregistrement
  it('should indicate error', () => {
    const registerSpy = jest.spyOn(authService, 'register').mockImplementation(() => throwError(() => new Error('err')));  // Simule une erreur dans le service d'enregistrement

    component.submit();  // Appelle la méthode de soumission du formulaire

    // Vérifie que le service d'enregistrement a bien été appelé et que l'erreur est correctement gérée
    expect(registerSpy).toHaveBeenCalled();
    expect(component.onError).toBe(true);
  });

  // Test pour vérifier la navigation après un enregistrement réussi
  it('should navigate to the login page', async () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(async () => true);  // Simule la navigation vers une autre page

    const authSpy = jest.spyOn(authService, 'register').mockImplementation(() => of(undefined));  // Simule un enregistrement réussi

    component.submit();  // Appelle la méthode de soumission du formulaire

    // Vérifie que le service d'enregistrement a été appelé et que la navigation vers la page de connexion a été effectuée
    expect(authSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
