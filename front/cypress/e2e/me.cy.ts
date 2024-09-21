// Fonction pour obtenir le nom du mois à partir de son numéro (1-12)
export function getMonthName (monthNumber: number) : String {
    // Crée un nouvel objet Date
    const date = new Date();
    // Définit le mois (le mois est basé sur l'index 0, donc on soustrait 1)
    date.setMonth(monthNumber-1);
    // Retourne le nom complet du mois en anglais
    return date.toLocaleString("en-US", { month : "long"});
  }
  
  // Suite de tests pour les informations utilisateur
  describe("Me spec", () => {
  
      // Test pour vérifier l'affichage des informations d'un utilisateur admin
      it("Shows admin user informations", () => {
          // Simulation de la connexion
          cy.visit('/login');
          
          // Interception de la requête POST pour le login avec des données d'utilisateur admin fictif
          cy.intercept('POST', '/api/auth/login', {
              body: {
                  id: 1,
                  username: "yoga@studio.com",  
                  firstName: 'Admin',           
                  lastName: 'Admin',            
                  admin: true                   
              }
          })
  
          // Simulation de la saisie de l'email et du mot de passe et soumission du formulaire
          cy.get('input[formControlName=email]').type("yoga@studio.com");
          cy.get('input[formControlName=password]').type(`${"test!12345"}{enter}{enter}`);
          
          // Vérifie que l'utilisateur est redirigé vers la page des sessions
          cy.url().should('include', '/sessions');
  
          // Définition des informations utilisateur simulées
          const userInfo = {
              id: 1,
              email: "yoga@studio.com",
              lastName: "Admin",
              firstName: "Admin",
              admin: true,
              createdAt: "2024-09-15 18:57:17",  
              updatedAt: "2024-09-15 18:57:17",  
          }
  
          // Interception de la requête GET pour récupérer les informations de l'utilisateur
          cy.intercept('GET', '/api/user/1', userInfo)
  
          // Clique sur le bouton pour accéder aux informations du compte
          cy.get('[routerlink="me"]').click();
  
          // Extraction des dates de création et mise à jour du compte et formatage
          const createdAtYear = userInfo.createdAt.slice(0,10).split("-")[0]; 
          const updatedAtYear = userInfo.updatedAt.slice(0,10).split("-")[0]; 
          const createdAtMonth = getMonthName(parseInt(userInfo.createdAt.slice(0,10).split("-")[1])); 
          const updatedAtMonth = getMonthName(parseInt(userInfo.updatedAt.slice(0,10).split("-")[1])); 
          const createdAtDay = parseInt(userInfo.createdAt.slice(0,10).split("-")[2]); 
          const updatedAtDay = parseInt(userInfo.updatedAt.slice(0,10).split("-")[2]); 
  
          // Vérifie que les informations de l'utilisateur sont visibles
          cy.contains(`${userInfo.firstName} ${userInfo.lastName.toUpperCase()}`).should('be.visible');
          cy.contains(userInfo.email).should('be.visible');
          cy.contains(userInfo.admin ? "You are admin" : "").should('be.visible');
          cy.contains(`${createdAtMonth} ${createdAtDay}, ${createdAtYear}`).should('be.visible');
          cy.contains(`${updatedAtMonth} ${updatedAtDay}, ${updatedAtYear}`).should('be.visible');
      })
  
      // Test pour vérifier l'affichage des informations d'un utilisateur non-admin
      it("Shows non admin user informations", () => {
          // Simulation de la connexion
          cy.visit('/login');
          
          // Interception de la requête POST pour le login avec des données d'utilisateur non-admin fictif
          cy.intercept('POST', '/api/auth/login', {
              body: {
                  id: 3,
                  username: "toto3@toto.com",  // Nom d'utilisateur
                  firstName: 'toto',           // Prénom
                  lastName: 'toto',            // Nom
                  admin: false                 // L'utilisateur n'est pas admin
              }
          })
  
          // Simulation de la saisie de l'email et du mot de passe et soumission du formulaire
          cy.get('input[formControlName=email]').type("toto3@toto.com");
          cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);
          
          // Vérifie que l'utilisateur est redirigé vers la page des sessions
          cy.url().should('include', '/sessions');
  
          // Définition des informations utilisateur simulées
          const userInfo = {
              id: 3,
              email: "toto3@toto.com",
              lastName: "toto",
              firstName: "toto",
              admin: false,
              createdAt: "2024-09-17 18:09:00",  // Date de création du compte
              updatedAt: "2024-09-17 18:14:49",  // Date de mise à jour du compte
          }
  
          // Interception de la requête GET pour récupérer les informations de l'utilisateur
          cy.intercept('GET', '/api/user/3', userInfo);
  
          // Clique sur le bouton pour accéder aux informations du compte
          cy.get('[routerlink="me"]').click();
  
          // Extraction des dates de création et mise à jour du compte et formatage
          const createdAtYear = userInfo.createdAt.slice(0,10).split("-")[0]; // Année de création
          const updatedAtYear = userInfo.updatedAt.slice(0,10).split("-")[0]; // Année de mise à jour
          const createdAtMonth = getMonthName(parseInt(userInfo.createdAt.slice(0,10).split("-")[1])); // Mois de création
          const updatedAtMonth = getMonthName(parseInt(userInfo.updatedAt.slice(0,10).split("-")[1])); // Mois de mise à jour
          const createdAtDay = parseInt(userInfo.createdAt.slice(0,10).split("-")[2]); // Jour de création
          const updatedAtDay = parseInt(userInfo.updatedAt.slice(0,10).split("-")[2]); // Jour de mise à jour
          
          // Vérifie que les informations de l'utilisateur sont visibles
          cy.contains(`${userInfo.firstName} ${userInfo.lastName.toUpperCase()}`).should('be.visible');
          cy.contains(userInfo.email).should('be.visible');
          cy.contains(userInfo.admin ? "You are admin" : "Delete my account:").should('be.visible');
          cy.contains(`${createdAtMonth} ${createdAtDay}, ${createdAtYear}`).should('be.visible');
          cy.contains(`${updatedAtMonth} ${updatedAtDay}, ${updatedAtYear}`).should('be.visible');
  
          // Vérifie que le bouton de suppression de compte est visible pour l'utilisateur non-admin
          cy.get('button.mat-raised-button').should("be.visible");
          cy.get('.my2 > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').should("contain", "delete");
          cy.get('.ml1').should("contain", "Detail");
      })
  })
  