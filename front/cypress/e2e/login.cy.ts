describe('Login spec', () => {
  
  // Définition du scénario de test "Login successful"
  it('Login successful', () => {
    
    // Ouvre la page de connexion à l'URL '/login'
    cy.visit('/login')

    // Intercepte la requête POST envoyée à l'API d'authentification lors de la soumission du formulaire de connexion
    // et renvoie une réponse fictive (mockée) contenant les informations de l'utilisateur connecté
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,                  
        username: 'userName',    
        firstName: 'firstName',  
        lastName: 'lastName',    
        admin: true              
      },
    })

    // Intercepte la requête GET envoyée à l'URL '/api/session' (pour obtenir les sessions de l'utilisateur)
    // et renvoie une réponse vide (pas de sessions disponibles pour l'instant)
    cy.intercept(
      {
        method: 'GET',      // Méthode HTTP (GET)
        url: '/api/session',// URL cible de la requête interceptée
      },
      []).as('session')     // Nom du stub intercepté (pour suivi éventuel)

    // Simule la saisie de l'email de l'utilisateur dans le champ de connexion
    cy.get('input[formControlName=email]').type("yoga@studio.com")

    // Simule la saisie du mot de passe de l'utilisateur dans le champ de connexion et appuie sur "Entrée" pour soumettre
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    // Vérifie que l'URL a changé après la connexion, en s'assurant qu'elle contient '/sessions'
    // Ce qui signifie que l'utilisateur a été redirigé vers la page des sessions après un login réussi
    cy.url().should('include', '/sessions')
  })
});
