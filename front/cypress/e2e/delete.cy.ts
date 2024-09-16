describe("Delete spec", () => {

    it("Deletes session", () => {
  
        // Visite la page de connexion
        cy.visit('/login');
  
        // Interception de la requête POST pour simuler un login
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: "yoga@studio.com",
                firstName: 'Admin',
                lastName: 'Admin',
                admin: true
            }
        });
  
        // Sessions fictives pour le test de suppression
        let sessions = [
            {
                id: 1,
                name: "session 1",
                description: "my description",
                date: "2012-01-01 01:00:00",
                teacher_id: 1,
                users: [],
                createdAt: "2024-09-14 14:40:55",
                updatedAt: "2024-09-16 07:40:55",
            },
            {
                id: 2,
                name: "Session",
                description: "description",
                date: "2024-09-12 02:00:00",
                teacher_id: 2,
                users: [],
                createdAt: "2024-09-12 23:13:47",
                updatedAt: "2024-09-12 23:13:47",
            }
        ]
  
        // Interception de la requête GET pour récupérer les sessions
        cy.intercept("GET", '/api/session', {
            body: sessions,
        });
        
        // Enseignants fictifs pour les tests
        const teachers = [
            {
                id: 1,
                lastName: "DELAHAYE",
                firstName: "Margot",
                createdAt: "2024-09-12 18:57:01",
                updatedAt: "2024-09-12 18:57:01",
            },
            {
                id: 2,
                lastName: "THIERCELIN",
                firstName: "Hélène",
                createdAt: "2024-09-12 18:59:00",
                updatedAt: "2024-09-12 18:59:00",
            },
        ]
  
        // Interception de la requête GET pour récupérer les enseignants
        cy.intercept('GET', '/api/teacher', teachers);
  
        // Remplissage des champs de connexion avec des informations fictives
        cy.get('input[formControlName=email]').type("yoga@studio.com");
        cy.get('input[formControlName=password]').type(`${"test!12345"}{enter}{enter}`);
  
        // Vérification que le bouton de connexion est activé
        cy.get('.mat-raised-button').should("be.enabled");
  
        // Vérifie que l'URL après la connexion inclut "/sessions"
        cy.url().should('include', '/sessions');
        
        // Sélection de la session à supprimer
        let session = {
            id: 1,
            name: "session 1",
            description: "my description",
            date: "2012-01-01 01:00:00",
            teacher_id: 1,
            users: [],
            createdAt: "2024-09-14 14:40:55",
            updatedAt: "2024-09-16 07:40:55",           
        }
  
        // Recherche de l'enseignant associé à la session
        const teacher = teachers.find((teacher) => teacher.id == session.teacher_id);
  
        // Interception de la requête GET pour récupérer les détails de la session et de l'enseignant
        cy.intercept("GET", `/api/session/${session.id}`, session);
        cy.intercept("GET", `/api/teacher/${session.teacher_id}`, teacher);
  
        // Simule un clic sur le bouton "Detail" pour afficher les détails de la session
        cy.contains('Detail').click();
  
        // Vérifie que l'URL inclut les détails de la session
        cy.url().should("include", `/sessions/detail/${session.id}`);
  
        // Interception de la requête DELETE pour supprimer la session
        cy.intercept("DELETE", `/api/session/${session.id}`, {});
  
        // Met à jour la liste des sessions après suppression, en enlevant la session supprimée
        const sessionsList = sessions.filter(s => s.id !== session.id);
  
        // Interception de la requête GET pour renvoyer la liste des sessions après suppression
        cy.intercept("GET", "/api/session", {
            body: sessionsList,
        })
  
        // Simule un clic sur le bouton "Delete" pour supprimer la session
        cy.contains("Delete").click();
  
        // Vérifie que l'URL est redirigée vers la liste des sessions après suppression
        cy.url().should("include", "/sessions")
  
    });
  
  });
  