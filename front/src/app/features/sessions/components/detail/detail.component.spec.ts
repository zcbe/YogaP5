import { HttpClientTestingModule } from '@angular/common/http/testing'; 
// Utilisation de HttpClientTestingModule pour tester les requêtes HTTP sans faire de vrais appels réseau.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';

import { TeacherService } from '../../../../services/teacher.service'; 
// Importation du service TeacherService pour récupérer les informations du professeur.

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; 
// Importation de MatCardModule et MatIconModule pour gérer l'interface utilisateur avec les cartes et icônes Material.

import { SessionApiService } from '../../services/session-api.service'; 
// Importation du service SessionApiService pour interagir avec les API liées aux sessions.

import { Router } from '@angular/router'; 
// Importation du Router pour gérer les navigations au sein de l'application.

import { of } from 'rxjs'; 
// Importation d'of de RxJS pour créer des observables fictifs dans les tests.

import { By } from '@angular/platform-browser'; 
// Utilisation de By pour rechercher des éléments dans le DOM lors des tests.

import { NoopAnimationsModule } from '@angular/platform-browser/animations'; 
// Importation de NoopAnimationsModule pour désactiver les animations lors des tests (accélère les tests).

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let router: Router;
  let snackbar: MatSnackBar;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule, // Utilisation de HttpClientTestingModule pour tester les requêtes HTTP sans faire de vrais appels réseau.
        ReactiveFormsModule,
        NoopAnimationsModule, // Importation de NoopAnimationsModule pour désactiver les animations lors des tests (accélère les tests).
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
        ],
      declarations: [DetailComponent], 
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    sessionApiService = TestBed.inject(SessionApiService); // Déclaration de sessionApiService pour les tests.
    teacherService = TestBed.inject(TeacherService); // Déclaration de teacherService pour les tests.
    router = TestBed.inject(Router); // Déclaration de router pour la gestion de navigation dans les tests.
    snackbar = TestBed.inject(MatSnackBar); // Déclaration de snackbar pour afficher des notifications dans les tests.
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    component.session = session; // Ajout d'une session fictive au composant pour tester ses fonctionnalités.
    fixture.detectChanges();
  });

  it('should be created successfully', () => {
    // WHEN
    component.ngOnInit();

    // THEN
    expect(component).toBeTruthy();
  });

  it('should not display delete button when user is not an admin', () => {
    // GIVEN
    component.isAdmin = false;

    // WHEN
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const deleteButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Delete')
    );

    // THEN
    expect(deleteButton).toBeFalsy();
  });

  it('should display delete button when user is an admin', () => {
    // GIVEN
    component.isAdmin = true;

    // WHEN
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const deleteButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Delete')
    );

    // THEN
    expect(deleteButton).toBeTruthy();
  });

  it('should call participate function when participate button is clicked', () => {
    // GIVEN
    component.isAdmin = false;
    component.isParticipate = false;
    fixture.detectChanges();

    // WHEN
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const participateButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Participate')
    );

    const componentSpy = jest
      .spyOn(component, 'participate')
      .mockImplementation(() => {});
    participateButton!.nativeElement.click();

    // THEN
    expect(componentSpy).toHaveBeenCalled();
  });

  it('should call unParticipate function when do not participate button is clicked', () => {
    // GIVEN
    component.isAdmin = false;
    component.isParticipate = true;
    fixture.detectChanges();

    // WHEN
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const participateButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Do not participate')
    );

    const componentSpy = jest
      .spyOn(component, 'unParticipate')
      .mockImplementation(() => {});
    participateButton!.nativeElement.click();

    // THEN
    expect(componentSpy).toHaveBeenCalled();
  });

  it('should recover the session on participate', () => {
    // GIVEN
    component.session = undefined;
    jest
      .spyOn(sessionApiService, 'participate')
      .mockImplementation(() => of(undefined));
    const detailSpy = jest
      .spyOn(sessionApiService, 'detail')
      .mockImplementation(() => of(session));

    // WHEN
    component.participate();

    // THEN
    expect(detailSpy).toHaveBeenCalled();
    expect(component.session).toEqual(session);
  });

  it('should recover the session on unParticipate', () => {
    // GIVEN
    component.session = undefined;

    jest
      .spyOn(sessionApiService, 'unParticipate')
      .mockImplementation(() => of(undefined));
    const detailSpy = jest
      .spyOn(sessionApiService, 'detail')
      .mockImplementation(() => of(session));

    // WHEN
    component.unParticipate();

    // THEN
    expect(detailSpy).toHaveBeenCalled();
    expect(component.session).toEqual(session);
  });

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
      .spyOn(sessionApiService, 'detail')
      .mockImplementation(() => of(session));
    jest.spyOn(teacherService, 'detail').mockImplementation(() => of(teacher));

    // WHEN
    component.ngOnInit();

    // THEN
    expect(component.teacher).toEqual(teacher);
  });

  it('should open a snackbar and redirect to the sessions page on delete', () => {
    // GIVEN
    component.isAdmin = true;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const deleteButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('Delete')
    );

    const componentSpy = jest.spyOn(component, 'delete');
    const sessionApiSpy = jest
      .spyOn(sessionApiService, 'delete')
      .mockImplementation(() => of(true));
    const matSnackBarSpy = jest.spyOn(snackbar, 'open');
    const routerSpy = jest
      .spyOn(router, 'navigate')
      .mockImplementation(async () => true);

    // WHEN
    deleteButton!.nativeElement.click();

    // THEN
    expect(componentSpy).toHaveBeenCalled();
    expect(sessionApiSpy).toHaveBeenCalled();
    expect(matSnackBarSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['sessions']);
  });

  it('should navigate back when back function is called', () => {
    // GIVEN
    const spy = jest.spyOn(window.history, 'back').mockImplementation(() => {});

    // WHEN
    component.back();

    // THEN
    expect(spy).toHaveBeenCalled();
  });
});
