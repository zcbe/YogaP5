describe('Register spec', () => {
  it('should register successfull', () => {
      cy.visit('/');
      cy.get('[routerlink]').contains('Register').click();

      cy.intercept('POST', '/api/auth/register', {});

      cy.get('input[formControlName=firstName]').type('Test');
      cy.get('input[formControlName=lastName]').type('TEST');
      cy.get('input[formControlName=email]').type('test@mail.com');
      cy.get('input[formControlName=password]').type('password{enter}{enter}');

      cy.url().should('include', '/login');
    });

});