describe("Detail spec", () => {
  it("Participate to session", () => {
      // Login mock
      cy.visit('/login');

      const user = {
          id: 4,
          username: "toto3@toto.com",
          firstName: 'toto',
          lastName: 'toto',
          admin: false
      }
      cy.intercept('POST', '/api/auth/login', {
          body: user
      });

      let sessions = [
          {
              id: 1,
              name: "session 1",
              description: "my description",
              date: "2012-01-01 01:00:00",
              teacher_id: 1,
              users: [],
              createdAt: "2024-09-08 18:45:03",
              updatedAt: "2024-09-12 23:23:22",
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

      cy.intercept("GET", '/api/session', {
          body: sessions,
      });

      const teachers = [
          {
              id: 1,
              lastName: "DELAHAYE",
              firstName: "Margot",
              createdAt: "2024-08-29 18:57:01",
              updatedAt: "2024-08-29 18:57:01",
          },
          {
              id: 2,
              lastName: "THIERCELIN",
              firstName: "Hélène",
              createdAt: "2024-08-29 18:57:01",
              updatedAt: "2024-08-29 18:57:01",
          },
      ]

      cy.intercept('GET', '/api/teacher', teachers);

      cy.get('input[formControlName=email]').type("toto3@toto.com");
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

      cy.get('.mat-raised-button').should("be.enabled");
      cy.url().should('include', '/sessions');

      let session = {
          id: 1,
          name: "session 1",
          description: "my description",
          date: "2012-01-01 01:00:00",
          teacher_id: 1,
          users: [],
          createdAt: "2024-09-08 18:45:03",
          updatedAt: "2024-09-12 23:23:22",            
      }

      const teacher = teachers.find((teacher) => teacher.id == session.teacher_id);

      cy.intercept("GET", "/api/session/1", {
          body:session
      });

      cy.intercept("GET", `/api/teacher/${session.id}`, teacher)

      const sessionCard =  cy.get('.items > :nth-child(1)');
      sessionCard.contains('Detail').click();
      cy.contains('Participate').should("be.visible");

      cy.intercept("POST", `/api/session/1/participate/${user.id}`, {})
      cy.intercept("GET", "/api/session/1", {
          id: 1,
          name: "session 1",
          description: "my description",
          date: "2012-01-01 01:00:00",
          teacher_id: 1,
          users: [user.id],
          createdAt: "2024-09-08 18:45:03",
          updatedAt: "2024-09-12 23:23:22",            
      })
      cy.contains("Participate").click();


  })

  it("Cancel participation", () => {
      // Login mock
      cy.visit('/login');

      const user = {
          id: 4,
          username: "toto3@toto.com",
          firstName: 'toto',
          lastName: 'toto',
          admin: false
      }
      cy.intercept('POST', '/api/auth/login', {
          body: user
      });

      let sessions = [
          {
              id: 1,
              name: "session 1",
              description: "my description",
              date: "2012-01-01 01:00:00",
              teacher_id: 1,
              users: [],
              createdAt: "2024-09-08 18:45:03",
              updatedAt: "2024-09-12 23:23:22",
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

      cy.intercept("GET", '/api/session', {
          body: sessions,
      });

      const teachers = [
          {
              id: 1,
              lastName: "DELAHAYE",
              firstName: "Margot",
              createdAt: "2024-08-29 18:57:01",
              updatedAt: "2024-08-29 18:57:01",
          },
          {
              id: 2,
              lastName: "THIERCELIN",
              firstName: "Hélène",
              createdAt: "2024-08-29 18:57:01",
              updatedAt: "2024-08-29 18:57:01",
          },
      ]

      cy.intercept('GET', '/api/teacher', teachers);

      cy.get('input[formControlName=email]').type("toto3@toto.com");
      cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

      cy.get('.mat-raised-button').should("be.enabled");
      cy.url().should('include', '/sessions');

      let session = {
          id: 1,
          name: "session 1",
          description: "my description",
          date: "2012-01-01 01:00:00",
          teacher_id: 1,
          users: [user.id],
          createdAt: "2024-09-08 18:45:03",
          updatedAt: "2024-09-12 23:23:22",            
      }

      const teacher = teachers.find((teacher) => teacher.id == session.teacher_id);

      cy.intercept("GET", "/api/session/1", {
          body:session
      });

      cy.intercept("GET", `/api/teacher/${session.id}`, teacher)

      const sessionCard =  cy.get('.items > :nth-child(1)');
      sessionCard.contains('Detail').click();
      
      cy.intercept("DELETE", `/api/session/1/participate/${user.id}`, {});
      cy.intercept("GET", "/api/session/1", {
          id: 1,
          name: "session 1",
          description: "my description",
          date: "2012-01-01 01:00:00",
          teacher_id: 1,
          users: [],
          createdAt: "2024-09-08 18:45:03",
          updatedAt: "2024-09-12 23:23:22",            
      })
      // Do not participate button
      const doNotParticipateButton =  cy.contains('Do not participate');
      doNotParticipateButton.should("be.visible");
      doNotParticipateButton.click();
  })
})