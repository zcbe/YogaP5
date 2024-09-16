describe("Detail spec", () => {
    // Test pour vérifier que l'utilisateur peut participer à une session
    it("Participate to session", () => {
        // Simulation du login
        cy.visit('/login');
  
        const user = {
            id: 4,
            username: "toto3@toto.com",
            firstName: 'toto',
            lastName: 'toto',
            admin: false
        }
        // Interception de la requête de connexion avec des informations utilisateur mockées
        cy.intercept('POST', '/api/auth/login', {
            body: user
        });
  
        // Simulation d'une liste de sessions disponibles
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
  
        // Interception de la requête pour récupérer les sessions
        cy.intercept("GET", '/api/session', {
            body: sessions,
        });
  
        // Simulation des enseignants associés aux sessions
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
  
        // Interception de la requête pour récupérer les enseignants
        cy.intercept('GET', '/api/teacher', teachers);
  
        // Remplir le formulaire de connexion
        cy.get('input[formControlName=email]').type("toto3@toto.com");
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);
  
        // Vérifier que le bouton de connexion est activé et que l'URL contient '/sessions'
        cy.get('.mat-raised-button').should("be.enabled");
        cy.url().should('include', '/sessions');
  
        // Définir la session à laquelle l'utilisateur va participer
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
  
        // Trouver l'enseignant associé à cette session
        const teacher = teachers.find((teacher) => teacher.id == session.teacher_id);
  
        // Interception pour récupérer les détails de la session
        cy.intercept("GET", "/api/session/1", {
            body: session
        });
  
        // Interception pour récupérer les détails de l'enseignant de la session
        cy.intercept("GET", `/api/teacher/${session.id}`, teacher)
  
        // Accéder au détail de la session
        const sessionCard = cy.get('.items > :nth-child(1)');
        sessionCard.contains('Detail').click();
  
        // Vérifier que le bouton 'Participate' est visible
        cy.contains('Participate').should("be.visible");
  
        // Interception pour la participation à la session et mise à jour des utilisateurs de la session
        cy.intercept("POST", `/api/session/1/participate/${user.id}`, {})
        cy.intercept("GET", "/api/session/1", {
            id: 1,
            name: "session 1",
            description: "my description",
            date: "2012-01-01 01:00:00",
            teacher_id: 1,
            users: [user.id], // Ajout de l'utilisateur à la liste des participants
            createdAt: "2024-09-14 14:40:55",
            updatedAt: "2024-09-16 07:40:55",        
        })
  
        // Cliquer sur le bouton 'Participate' pour participer à la session
        cy.contains("Participate").click();
    });
  
    // Test pour vérifier que l'utilisateur peut annuler sa participation à une session
    it("Cancel participation", () => {
        // Simulation du login
        cy.visit('/login');
  
        const user = {
            id: 4,
            username: "toto3@toto.com",
            firstName: 'toto',
            lastName: 'toto',
            admin: false
        }
        // Interception de la requête de connexion avec des informations utilisateur mockées
        cy.intercept('POST', '/api/auth/login', {
            body: user
        });
  
        // Simulation d'une liste de sessions disponibles
        let sessions = [
            {
                id: 1,
                name: "session 1",
                description: "my description",
                date: "2012-01-01 01:00:00",
                teacher_id: 1,
                users: [user.id], // L'utilisateur est déjà inscrit à cette session
                createdAt: "2024-09-14 14:40:55",
                updatedAt: "2024-09-16 07:40:55",
            },
            {
                id: 2,
                name: "Session",
                description: "description",
                date: "2023-09-12 02:00:00",
                teacher_id: 2,
                users: [],
                createdAt: "2024-09-12 23:13:47",
                updatedAt: "2024-09-12 23:13:47",
            }
        ]
  
        // Interception pour récupérer les sessions disponibles
        cy.intercept("GET", '/api/session', {
            body: sessions,
        });
  
        // Simulation des enseignants associés aux sessions
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
  
        // Interception pour récupérer les enseignants
        cy.intercept('GET', '/api/teacher', teachers);
  
        // Remplir le formulaire de connexion
        cy.get('input[formControlName=email]').type("toto3@toto.com");
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);
  
        // Vérifier que le bouton de connexion est activé et que l'URL contient '/sessions'
        cy.get('.mat-raised-button').should("be.enabled");
        cy.url().should('include', '/sessions');
  
        // Définir la session dans laquelle l'utilisateur est déjà inscrit
        let session = {
            id: 1,
            name: "session 1",
            description: "my description",
            date: "2012-01-01 01:00:00",
            teacher_id: 1,
            users: [user.id], // L'utilisateur est inscrit
            createdAt: "2024-09-14 14:40:55",
            updatedAt: "2024-09-16 07:40:55",            
        }
  
        // Interception pour récupérer les détails de la session
        cy.intercept("GET", "/api/session/1", {
            body: session
        });
  
        // Interception pour récupérer l'enseignant de la session
        cy.intercept("GET", `/api/teacher/${session.id}`, teachers.find((teacher) => teacher.id == session.teacher_id));
  
        // Cliquer sur la carte de session pour afficher les détails
        const sessionCard = cy.get('.items > :nth-child(1)');
        sessionCard.contains('Detail').click();
  
        // Interception pour annuler la participation
        cy.intercept("DELETE", `/api/session/1/participate/${user.id}`, {});
        cy.intercept("GET", "/api/session/1", {
            id: 1,
            name: "session 1",
            description: "my description",
            date: "2012-01-01 01:00:00",
            teacher_id: 1,
            users: [], // L'utilisateur est retiré de la session
            createdAt: "2024-09-14 14:40:55",
            updatedAt: "2024-09-16 07:40:55",           
        });
  
        // Vérifier que le bouton 'Do not participate' est visible et cliquer dessus pour annuler la participation
        const doNotParticipateButton = cy.contains('Do not participate');
        doNotParticipateButton.should("be.visible");
        doNotParticipateButton.click();
    });
  });
  