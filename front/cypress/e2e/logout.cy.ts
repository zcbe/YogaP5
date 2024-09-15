describe("Logout spec", () => {
  it("Logout successfully", () => {
      // Mock login first
      cy.visit('/login');

      cy.intercept('POST', '/api/auth/login', {
          body: {
            id: 1,
            username: 'yoga@studio.com',
            firstName: 'Admin',
            lastName: 'Admin',
            admin: true
          },
      })
      
      cy.get('input[formControlName=email]').type("yoga@studio.com");
      cy.get('input[formControlName=password]').type(`${"test!12345"}{enter}{enter}`);
      
      cy.get('.mat-raised-button').should("be.enabled");
      cy.url().should('include', '/sessions');

      // Mock logout then
      cy.contains('Logout').click();

      cy.url().should('include', '/');
  })
});