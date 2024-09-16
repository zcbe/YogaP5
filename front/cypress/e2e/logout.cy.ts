describe("Logout spec", () => {

  it("Logout successfully", () => {
      
      // Étape de simulation du login d'abord

      // Accède à la page de connexion
      cy.visit('/login');

      // Interception de la requête POST lors de la soumission du formulaire de connexion
      // Réponse simulée (mock) pour un utilisateur administrateur avec des informations fictives
      cy.intercept('POST', '/api/auth/login', {
          body: {
            id: 1,                   
            username: 'yoga@studio.com',  
            firstName: 'Admin',       
            lastName: 'Admin',        
            admin: true               
          },
      })

      // Simule la saisie de l'email dans le champ de connexion
      cy.get('input[formControlName=email]').type("yoga@studio.com");
      
      // Simule la saisie du mot de passe et soumission du formulaire avec {enter}{enter}
      cy.get('input[formControlName=password]').type(`${"test!12345"}{enter}{enter}`);
      
      // Vérifie que le bouton de connexion est activé
      cy.get('.mat-raised-button').should("be.enabled");

      // Vérifie que l'URL change et contient '/sessions', ce qui signifie que l'utilisateur est redirigé
      cy.url().should('include', '/sessions');

      // Étape de simulation de la déconnexion (logout)

      // Trouve le bouton ou le lien contenant le texte "Logout" et clique dessus
      cy.contains('Logout').click();

      // Vérifie que l'utilisateur est redirigé vers la page principale, ici représentée par l'URL "/"
      cy.url().should('include', '/');
  })
});
