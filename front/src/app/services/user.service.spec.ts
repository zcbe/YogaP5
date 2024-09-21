import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Importation pour les tests HTTP
import { TestBed } from '@angular/core/testing'; // Importation de TestBed pour configurer les tests
import { expect } from '@jest/globals'; // Importation de expect pour les assertions avec Jest

import { UserService } from './user.service'; // Importation du service utilisateur à tester

describe('UserService', () => {
  let service: UserService; // Déclaration d'une variable pour le service utilisateur
  let httpMock: HttpTestingController; // Déclaration d'une variable pour le contrôleur de tests HTTP

  // Configuration du test avant chaque test individuel
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importation du module de tests HTTP
      providers: [UserService], // Fourniture du service utilisateur
    });
    service = TestBed.inject(UserService); // Injection de l'instance de UserService
    httpMock = TestBed.inject(HttpTestingController); // Injection du contrôleur de tests HTTP
  });

  // Test pour vérifier que le service est créé avec succès
  it('should be created', () => {
    // THEN
    expect(service).toBeTruthy(); // Vérifie que l'instance du service existe
  });

  // Test pour vérifier la récupération d'un utilisateur par ID
  it('should get user by id', () => {
    // WHEN
    service.getById('1').subscribe((response) => {
      // THEN
      expect(response).toBeTruthy(); // Vérifie que la réponse est vraie
      expect(response.id).toBe(1); // Vérifie que l'ID de l'utilisateur est correct
      expect(response.firstName).toBe('Toto'); // Vérifie que le prénom est correct
    });

    const request = httpMock.expectOne('api/user/1'); // Vérifie qu'une requête HTTP a été effectuée
    expect(request.request.method).toEqual('GET'); // Vérifie que la méthode de la requête est GET

    // Simule la réponse de la requête
    request.flush({
      id: 1,
      firstName: 'Test',
      lastName: 'TEST',
      email: 'mail@test.com',
      createdAt: new Date(Date.now()), 
      updatedAt: new Date(Date.now()),
    });
  });

  // Test pour vérifier la suppression d'un utilisateur
  it('should delete', () => {
    // WHEN
    service.delete('1').subscribe((response) => {
      // THEN
      expect(response).toBe(undefined); // Vérifie que la réponse est indéfinie (aucun contenu)
    });

    const request = httpMock.expectOne('api/user/1'); // Vérifie qu'une requête de suppression a été effectuée
    expect(request.request.method).toEqual('DELETE'); // Vérifie que la méthode de la requête est DELETE
  });
});
