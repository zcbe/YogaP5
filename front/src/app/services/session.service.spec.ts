import { TestBed } from '@angular/core/testing'; 
import { expect } from '@jest/globals'; // Importation de expect pour les assertions avec Jest

import { SessionService } from './session.service'; // Importation du service de session à tester
import { lastValueFrom } from 'rxjs'; // Importation pour transformer un observable en promesse


describe('SessionService', () => {
  let service: SessionService; // Déclaration d'une variable pour le service de session

  // Configuration du test avant chaque test individuel
  beforeEach(() => {
    TestBed.configureTestingModule({}); // Configuration du module de test
    service = TestBed.inject(SessionService); // Injection de l'instance de SessionService
  });

  // Test pour vérifier que le service est créé avec succès
  it('should be created', () => {
    // THEN
    expect(service).toBeTruthy(); // Vérifie que l'instance du service existe
  });

  // Test pour vérifier la déconnexion
  it('should logout', () => {
    // WHEN
    service.logOut(); // Appel de la méthode logOut pour se déconnecter

    // THEN
    expect(service.isLogged).toBe(false); // Vérifie que l'état de connexion est faux
    expect(service.sessionInformation).toBe(undefined); // Vérifie que les informations de session sont indéfinies
    expect(lastValueFrom(service.$isLogged())).resolves.toBe(false); // Vérifie que l'observable renvoie false
  });

  // Test pour vérifier la connexion
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
    }; // Informations de session à utiliser lors de la connexion

    // WHEN
    service.logIn(sessionInfo); // Appel de la méthode logIn avec les informations de session

    // THEN
    expect(service.isLogged).toBe(true); // Vérifie que l'état de connexion est vrai
    expect(service.sessionInformation).toEqual(sessionInfo); // Vérifie que les informations de session correspondent aux données fournies
    expect(lastValueFrom(service.$isLogged())).resolves.toBe(true); // Vérifie que l'observable renvoie true
  });
});
