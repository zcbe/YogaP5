describe("Create spec", () => {
  
    it("Creates session", () => {
        
        // Visite la page de connexion
        cy.visit('/login');
  
        // Interception de la requête POST vers l'API de connexion
        // Simule une connexion avec un utilisateur administrateur
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: "yoga@studio.com",
                firstName: 'Admin',
                lastName: 'Admin',
                admin: true
            }
        });
  
        // Sessions fictives pour les tests
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
                createdAt: "2024-09-15 13:40:55",
                updatedAt: "2024-09-15 13:40:55",
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
  
        // Remplissage des champs de connexion
        cy.get('input[formControlName=email]').type("yoga@studio.com");
        cy.get('input[formControlName=password]').type(`${"test!12345"}{enter}{enter}`);
  
        // Vérifie que le bouton est activé après la saisie
        cy.get('.mat-raised-button').should("be.enabled");
  
        // Vérifie que l'URL inclut "/sessions" après connexion
        cy.url().should('include', '/sessions');
  
        // Simule un clic sur le bouton "Create"
        cy.contains('Create').click();
  
        // Vérifie que l'URL inclut "/sessions/create"
        cy.url().should('include', '/sessions/create');
  
        // Préparation des données de la nouvelle session
        const selectedTeacher = teachers[0];
        const sessionForm = {
            id: sessions[sessions.length - 1].id + 1,
            name: "Une session",
            date: "2024-09-15",
            teacher: `${selectedTeacher.firstName} ${selectedTeacher.lastName}`,
            description: "Une description",
        }
  
        // Remplissage du formulaire de création de session
        cy.get("input[formControlName=name]").type(sessionForm.name);
        cy.get("input[formControlName=date]").type(sessionForm.date);
  
        // Sélection de l'enseignant dans le formulaire
        const teacher_input = cy.get("mat-select[formControlName=teacher_id]");
        teacher_input.click();
        teacher_input.get("mat-option");
        teacher_input.contains(sessionForm.teacher).click();
  
        // Remplissage de la description
        cy.get("textarea[formControlName=description]").type(sessionForm.description);
  
        // Simulation de la requête POST pour créer une session
        const session = {
            id: sessionForm.id,
            name: sessionForm.name,
            description: sessionForm.description,
            date: sessionForm.date,
            teacher_id: selectedTeacher.id,
            users: [],
            createdAt: new Date().toDateString(),
            updatedAt: new Date().toDateString(),
        }
        cy.intercept("POST", "/api/session", {
            body: session
        });
        
        // Ajout de la nouvelle session à la liste des sessions
        const sessionsList = [...sessions, session]
  
        // Interception de la requête GET pour récupérer la liste des sessions mises à jour
        cy.intercept("GET", '/api/session', {
            body: sessionsList,
        });
  
        // Soumission du formulaire de création de session
        cy.get("button[type=submit]").click();
    });
  
    it("No creation, empty form fields, disabled submit button", () => {
        
        // Visite de la page de connexion
        cy.visit('/login');
  
        // Interception de la requête POST vers l'API de connexion
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: "yoga@studio.com",
                firstName: 'Admin',
                lastName: 'Admin',
                admin: true
            }
        });
  
        // Sessions fictives pour les tests
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
        ];
  
        // Interception de la requête GET pour récupérer les enseignants
        cy.intercept('GET', '/api/teacher', teachers);
  
        // Remplissage des champs de connexion
        cy.get('input[formControlName=email]').type("yoga@studio.com");
        cy.get('input[formControlName=password]').type(`${"test!12345"}{enter}{enter}`);
  
        // Vérifie que le bouton de connexion est activé
        cy.get('.mat-raised-button').should("be.enabled");
  
        // Vérifie que l'URL inclut "/sessions" après la connexion
        cy.url().should('include', '/sessions');
  
        // Simule un clic sur le bouton "Create"
        cy.contains('Create').click();
  
        // Vérifie que l'URL inclut "/sessions/create"
        cy.url().should('include', '/sessions/create');
  
        // Vérifie que les champs du formulaire sont vides
        const sessionForm = {
            name: "",
            date: "",
            teacher: "",
            description: "",
        }
  
        // Vérification des champs vides
        cy.get("input[formControlName=name]").should("have.value", sessionForm.name);
        cy.get("input[formControlName=date]").should("have.value", sessionForm.date);
        cy.get("textarea[formControlName=description]").should("have.value", sessionForm.description);
  
        // Vérification que le bouton "Soumettre" est désactivé lorsque les champs sont vides
        cy.get("button[type=submit]").should("be.disabled");
    })
  
  });
  