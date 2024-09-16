describe('Register spec', () => {
  // Test pour vérifier que l'inscription réussit
  it('should register successfully', () => {
      // Visite de la page d'accueil
      cy.visit('/');

      // Localise et clique sur le lien "Register" (inscription) en utilisant le routerLink
      cy.get('[routerlink]').contains('Register').click();

      // Interception de la requête POST pour l'inscription (register)
      cy.intercept('POST', '/api/auth/register', {});

      // Remplit le formulaire d'inscription
      cy.get('input[formControlName=firstName]').type('Test');   // Saisie du prénom
      cy.get('input[formControlName=lastName]').type('TEST');    // Saisie du nom
      cy.get('input[formControlName=email]').type('test@mail.com'); // Saisie de l'email
      cy.get('input[formControlName=password]').type('password{enter}{enter}'); // Saisie du mot de passe et soumission

      // Vérifie que l'URL actuelle contient '/login', indiquant une redirection vers la page de connexion après l'inscription
      cy.url().should('include', '/login');
  });
});
