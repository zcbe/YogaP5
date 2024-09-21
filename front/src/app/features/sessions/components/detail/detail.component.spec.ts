import { HttpClientTestingModule } from '@angular/common/http/testing'; 
// Utilisation de HttpClientTestingModule pour tester les requêtes HTTP sans faire de vrais appels réseau.

import { ComponentFixture, TestBed } from '@angular/core/testing'; // Importation des outils de test Angular.
import { ReactiveFormsModule } from '@angular/forms'; // Importation pour les formulaires réactifs.
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Importation pour afficher des notifications avec Angular Material.
import { RouterTestingModule } from '@angular/router/testing'; // Importation pour simuler la navigation dans les tests.
import { expect } from '@jest/globals'; // Importation de expect pour les assertions avec Jest.
import { SessionService } from '../../../../services/session.service'; // Importation du service de session.

import { DetailComponent } from './detail.component'; // Importation du composant à tester.

import { TeacherService } from '../../../../services/teacher.service'; 
// Importation du service TeacherService pour récupérer les informations du professeur.

import { MatCardModule } from '@angular/material/card'; // Importation pour les cartes Angular Material.
import { MatIconModule } from '@angular/material/icon'; 
// Importation pour les icônes Angular Material.

import { SessionApiService } from '../../services/session-api.service'; 
// Importation du service SessionApiService pour interagir avec les API liées aux sessions.

import { Router } from '@angular/router'; 
// Importation du Router pour gérer les navigations dans l'application.

import { of } from 'rxjs'; 
// Importation d'of de RxJS pour créer des observables fictifs dans les tests.

import { By } from '@angular/platform-browser'; 
// Importation de By pour rechercher des éléments dans le DOM lors des tests.

import { NoopAnimationsModule } from '@angular/platform-browser/animations'; 
// Importation de NoopAnimationsModule pour désactiver les animations pendant les tests.

describe('DetailComponent', () => {
  let component: DetailComponent; // Variable pour le composant à tester.
  let fixture: ComponentFixture<DetailComponent>; // Variable pour le fixture du composant.
  let sessionApiService: SessionApiService; // Variable pour le service de session API.
  let teacherService: TeacherService; // Variable pour le service des enseignants.
  let router: Router; // Variable pour le routeur.
  let snackbar: MatSnackBar; // Variable pour le snackbar (notification).

  // Mock du service de session
  const mockSessionService = {
    sessionInformation: {
      admin: true, // Simule un utilisateur administrateur.
      id: 1,
    },
  };

  // Exemple de session fictive pour les tests
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

  // Configuration des tests avant chaque cas de test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule, // Utilisation de HttpClientTestingModule pour les tests HTTP.
        ReactiveFormsModule,
        NoopAnimationsModule, // Désactivation des animations pour accélérer les tests.
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
      ],
      declarations: [DetailComponent], // Déclaration du composant à tester.
      providers: [{ provide: SessionService, useValue: mockSessionService }], // Fourniture d'un service de session simulé.
    }).compileComponents();

    // Injection des services nécessaires
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    router = TestBed.inject(Router);
    snackbar = TestBed.inject(MatSnackBar);
    fixture = TestBed.createComponent(DetailComponent); // Création de l'instance du composant.
    component = fixture.componentInstance; // Récupération de l'instance du composant.
    component.session = session; // Ajout d'une session fictive au composant.
    fixture.detectChanges(); // Déclenche la détection de changements pour le composant.
  });

  // Test pour vérifier que le composant est créé avec succès
  it('should be created successfully', () => {
    // WHEN
    component.ngOnInit(); // Appel de ngOnInit pour initialiser le composant.

    // THEN
    expect(component).toBeTruthy(); // Vérifie que le composant existe.
  });

  // Test pour vérifier que le bouton de suppression n'est pas affiché si l'utilisateur n'est pas administrateur
  it('should not display delete button when user is not an admin', () => {
    // GIVEN
    component.isAdmin = false; // Simule un utilisateur non administrateur.

    // WHEN
    fixture.detectChanges(); // Déclenche la détection de changements.
    const buttons = fixture.debugElement.queryAll(By.css('button')); // Recherche tous les boutons dans le DOM.
    const deleteButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Delete') // Cherche le bouton "Delete".
    );

    // THEN
    expect(deleteButton).toBeFalsy(); // Vérifie que le bouton "Delete" n'est pas présent.
  });

  // Test pour vérifier que le bouton de suppression est affiché si l'utilisateur est administrateur
  it('should display delete button when user is an admin', () => {
    // GIVEN
    component.isAdmin = true; // Simule un utilisateur administrateur.

    // WHEN
    fixture.detectChanges(); // Déclenche la détection de changements.
    const buttons = fixture.debugElement.queryAll(By.css('button')); // Recherche tous les boutons dans le DOM.
    const deleteButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Delete') // Cherche le bouton "Delete".
    );

    // THEN
    expect(deleteButton).toBeTruthy(); // Vérifie que le bouton "Delete" est présent.
  });

  // Test pour vérifier que la fonction participate est appelée lorsqu'on clique sur le bouton "Participate"
  it('should call participate function when participate button is clicked', () => {
    // GIVEN
    component.isAdmin = false; // Simule un utilisateur non administrateur.
    component.isParticipate = false; // Simule que l'utilisateur ne participe pas encore.
    fixture.detectChanges(); // Déclenche la détection de changements.

    // WHEN
    const buttons = fixture.debugElement.queryAll(By.css('button')); // Recherche tous les boutons dans le DOM.
    const participateButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Participate') // Cherche le bouton "Participate".
    );

    const componentSpy = jest
      .spyOn(component, 'participate') // Spy sur la fonction participate.
      .mockImplementation(() => {}); // Mocke la fonction pour éviter son exécution.
    participateButton!.nativeElement.click(); // Simule un clic sur le bouton "Participate".

    // THEN
    expect(componentSpy).toHaveBeenCalled(); // Vérifie que la fonction participate a été appelée.
  });

  // Test pour vérifier que la fonction unParticipate est appelée lorsqu'on clique sur le bouton "Do not participate"
  it('should call unParticipate function when do not participate button is clicked', () => {
    // GIVEN
    component.isAdmin = false; // Simule un utilisateur non administrateur.
    component.isParticipate = true; // Simule que l'utilisateur participe déjà.
    fixture.detectChanges(); // Déclenche la détection de changements.

    // WHEN
    const buttons = fixture.debugElement.queryAll(By.css('button')); // Recherche tous les boutons dans le DOM.
    const participateButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Do not participate') // Cherche le bouton "Do not participate".
    );

    const componentSpy = jest
      .spyOn(component, 'unParticipate') // Spy sur la fonction unParticipate.
      .mockImplementation(() => {}); // Mocke la fonction pour éviter son exécution.
    participateButton!.nativeElement.click(); // Simule un clic sur le bouton "Do not participate".

    // THEN
    expect(componentSpy).toHaveBeenCalled(); // Vérifie que la fonction unParticipate a été appelée.
  });

  // Test pour vérifier que la session est récupérée lors de la participation
  it('should recover the session on participate', () => {
    // GIVEN
    component.session = undefined; // Simule l'absence de session.
    jest
      .spyOn(sessionApiService, 'participate') // Spy sur la fonction participate du service.
      .mockImplementation(() => of(undefined)); // Mocke la fonction pour renvoyer undefined.
    const detailSpy = jest
      .spyOn(sessionApiService, 'detail') // Spy sur la fonction detail du service.
      .mockImplementation(() => of(session)); // Mocke la fonction pour renvoyer la session fictive.

    // WHEN
    component.participate(); // Appel de la fonction participate.

    // THEN
    expect(detailSpy).toHaveBeenCalled(); // Vérifie que la fonction detail a été appelée.
    expect(component.session).toEqual(session); // Vérifie que la session a été correctement récupérée.
  });

  // Test pour vérifier que la session est récupérée lors de l'annulation de la participation
  it('should recover the session on unParticipate', () => {
    // GIVEN
    component.session = undefined; // Simule l'absence de session.

    jest
      .spyOn(sessionApiService, 'unParticipate') // Spy sur la fonction unParticipate du service.
      .mockImplementation(() => of(undefined)); // Mocke la fonction pour renvoyer undefined.
    const detailSpy = jest
      .spyOn(sessionApiService, 'detail') // Spy sur la fonction detail du service.
      .mockImplementation(() => of(session)); // Mocke la fonction pour renvoyer la session fictive.

    // WHEN
    component.unParticipate(); // Appel de la fonction unParticipate.

    // THEN
    expect(detailSpy).toHaveBeenCalled(); // Vérifie que la fonction detail a été appelée.
    expect(component.session).toEqual(session); // Vérifie que la session a été correctement récupérée.
  });

  // Test pour vérifier que le professeur est récupéré lorsque la session est récupérée
  it('should get the teacher when the session is recovered', () => {
    // GIVEN
    const teacher = {
      id: 1,
      firstName: 'Test',
      lastName: 'TEST',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    };
    jest
      .spyOn(sessionApiService, 'detail') // Spy sur la fonction detail du service.
      .mockImplementation(() => of(session)); // Mocke la fonction pour renvoyer la session fictive.
    jest.spyOn(teacherService, 'detail').mockImplementation(() => of(teacher)); // Spy sur la fonction detail du service Teacher.

    // WHEN
    component.ngOnInit(); // Appel de ngOnInit pour initialiser le composant.

    // THEN
    expect(component.teacher).toEqual(teacher); // Vérifie que le professeur a été correctement récupéré.
  });

  // Test pour vérifier que le snackbar s'ouvre et que la navigation vers la page des sessions se fait lors de la suppression
  it('should open a snackbar and redirect to the sessions page on delete', () => {
    // GIVEN
    component.isAdmin = true; // Simule un utilisateur administrateur.
    fixture.detectChanges(); // Déclenche la détection de changements.

    const buttons = fixture.debugElement.queryAll(By.css('button')); // Recherche tous les boutons dans le DOM.
    const deleteButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Delete') // Cherche le bouton "Delete".
    );

    const componentSpy = jest.spyOn(component, 'delete'); // Spy sur la fonction delete.
    const sessionApiSpy = jest
      .spyOn(sessionApiService, 'delete') // Spy sur la fonction delete du service.
      .mockImplementation(() => of(true)); // Mocke la fonction pour renvoyer true.
    const matSnackBarSpy = jest.spyOn(snackbar, 'open'); // Spy sur la fonction open du snackbar.
    const routerSpy = jest
      .spyOn(router, 'navigate') // Spy sur la fonction navigate du routeur.
      .mockImplementation(async () => true); // Mocke la fonction pour éviter la navigation réelle.

    // WHEN
    deleteButton!.nativeElement.click(); // Simule un clic sur le bouton "Delete".

    // THEN
    expect(componentSpy).toHaveBeenCalled(); // Vérifie que la fonction delete a été appelée.
    expect(sessionApiSpy).toHaveBeenCalled(); // Vérifie que la fonction delete du service a été appelée.
    expect(matSnackBarSpy).toHaveBeenCalled(); // Vérifie que le snackbar a été ouvert.
    expect(routerSpy).toHaveBeenCalledWith(['sessions']); // Vérifie que la navigation vers la page des sessions a été effectuée.
  });

  // Test pour vérifier que la navigation se fait en arrière lors de l'appel de la fonction back
  it('should navigate back when back function is called', () => {
    // GIVEN
    const spy = jest.spyOn(window.history, 'back').mockImplementation(() => {}); // Spy sur la fonction back de l'historique.

    // WHEN
    component.back(); // Appel de la fonction back.

    // THEN
    expect(spy).toHaveBeenCalled(); // Vérifie que la fonction back a été appelée.
  });
});
