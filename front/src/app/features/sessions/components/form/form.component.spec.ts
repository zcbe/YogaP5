import { HttpClientTestingModule } from '@angular/common/http/testing'; // Remplace HttpClientModule pour les tests
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import de MatSnackBar pour les tests
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Remplacement de BrowserAnimationsModule pour les tests
import { Router } from '@angular/router'; // Import du Router pour les tests
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import { of } from 'rxjs'; // Import de 'of' pour simuler les observables

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let snackBar: MatSnackBar; // Déclaration de MatSnackBar pour les tests
  let sessionService: SessionService; // Déclaration de SessionService pour les tests
  let sessionApiService: SessionApiService; // Déclaration de SessionApiService pour les tests
  let router: Router; // Déclaration de Router pour les tests

  const sessionInformation = { // Déclaration des informations de session pour les tests
    admin: true,
    token: 'token',
    id: 1,
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    type: 'type',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule.withRoutes([ // Configuration des routes pour les tests
          { path: 'update', component: FormComponent },
        ]),
        HttpClientTestingModule, // Remplacement de HttpClientModule pour les tests
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule, 
        MatSnackBarModule,
        MatSelectModule,
        NoopAnimationsModule, // Remplacement de BrowserAnimationsModule pour les tests
      ],
      providers: [
        {
          provide: SessionService,
          useValue: { sessionInformation }, // Utilisation d'un objet mock pour SessionService
        },
      ],
      declarations: [FormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    snackBar = TestBed.inject(MatSnackBar); // Initialisation de MatSnackBar pour les tests
    router = TestBed.inject(Router); // Initialisation du Router pour les tests
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created successfully', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should redirect to the sessions page when user is not an admin', () => { // Test pour vérifier la redirection
    const spy = jest
      .spyOn(router, 'navigate') // Spy pour vérifier que la méthode navigate est appelée
      .mockImplementation(async () => true);
    const modifiedSessionInformation = {
      ...sessionInformation,
      admin: false,
    };
    sessionService.sessionInformation = modifiedSessionInformation;

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(['/sessions']); // Vérification que la redirection se fait bien vers '/sessions'
  });

  it('should show an error message when the form is empty', () => { // Test pour vérifier l'affichage des messages d'erreur
    const formElement: HTMLElement = fixture.nativeElement;
    const submitButton = formElement.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    );
    if (!submitButton) {
      throw new Error('Submit button not found');
    }

    submitButton.click();
    fixture.detectChanges();

    expect(
      formElement.querySelectorAll('mat-form-field.ng-invalid')
    ).toHaveLength(4); // Vérification que le formulaire contient 4 champs invalides
  });

  it('should get the values of the sessions when updating', async () => { // Test pour vérifier la récupération des valeurs des sessions lors de la mise à jour
    const session = {
      id: 1,
      name: 'Test',
      description: 'Test',
      date: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      teacher_id: 1,
      users: [1, 2, 3],
    };
    jest.spyOn(router, 'url', 'get').mockReturnValue('/update'); // Spy pour la méthode url du Router
    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(session)); // Spy pour la méthode detail de sessionApiService

    component.ngOnInit();

    expect(router.url).toBe('/update'); // Vérification que l'URL est bien '/update'
    expect(component.sessionForm?.value.name).toEqual(session.name); // Vérification que le nom de la session est bien récupéré
    expect(component.onUpdate).toBe(true); // Vérification que le mode de mise à jour est activé
  });

  it('should submit an update form', () => { // Test pour vérifier la soumission du formulaire de mise à jour
    const session = {
      id: 1,
      name: 'Test',
      description: 'Test',
      date: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      teacher_id: 1,
      users: [1, 2, 3],
    };
    component.onUpdate = true;
    const sessionApiUpdateSpy = jest
      .spyOn(sessionApiService, 'update') // Spy pour la méthode update de sessionApiService
      .mockReturnValue(of(session));
    const snackBarSpy = jest.spyOn(snackBar, 'open'); // Spy pour la méthode open de MatSnackBar
    const routerSpy = jest
      .spyOn(router, 'navigate') // Spy pour la méthode navigate du Router
      .mockImplementation(async () => true);

    component.submit();

    expect(sessionApiUpdateSpy).toHaveBeenCalled(); // Vérification que la méthode update a été appelée
    expect(snackBarSpy).toHaveBeenCalled(); // Vérification que la méthode open de MatSnackBar a été appelée
    expect(routerSpy).toHaveBeenCalledWith(['sessions']); // Vérification que la redirection se fait bien vers '/sessions'
  });

  it('should submit a create form', () => { // Test pour vérifier la soumission du formulaire de création
    const session = {
      id: 1,
      name: 'Test',
      description: 'Test',
      date: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      teacher_id: 1,
      users: [1, 2, 3],
    };
    component.onUpdate = false;
    const sessionApiCreateSpy = jest
      .spyOn(sessionApiService, 'create') // Spy pour la méthode create de sessionApiService
      .mockReturnValue(of(session));
    const snackBarSpy = jest.spyOn(snackBar, 'open'); // Spy pour la méthode open de MatSnackBar
    const routerSpy = jest
      .spyOn(router, 'navigate') // Spy pour la méthode navigate du Router
      .mockImplementation(async () => true);

    component.submit();

    expect(sessionApiCreateSpy).toHaveBeenCalled(); // Vérification que la méthode create a été appelée
    expect(snackBarSpy).toHaveBeenCalled(); // Vérification que la méthode open de MatSnackBar a été appelée
    expect(routerSpy).toHaveBeenCalledWith(['sessions']); // Vérification que la redirection se fait bien vers '/sessions'
  });
});
