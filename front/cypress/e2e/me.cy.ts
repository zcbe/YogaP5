export function getMonthName (monthNumber: number) : String {
  const date = new Date();
  date.setMonth(monthNumber-1);
  return date.toLocaleString("en-US", { month : "long"});
}
describe("Me spec", () => {
    it("Shows admin user informations", () => {
        // Login mock
        cy.visit('/login');
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 1,
                username: "yoga@studio.com",
                firstName: 'Admin',
                lastName: 'Admin',
                admin: true
            }
        })

        cy.get('input[formControlName=email]').type("yoga@studio.com");
        cy.get('input[formControlName=password]').type(`${"test!12345"}{enter}{enter}`);
        
        cy.url().should('include', '/sessions');

        const userInfo = {
            id: 1,
            email: "yoga@studio.com",
            lastName: "Admin",
            firstName: "Admin",
            admin: true,
            createdAt: "2024-09-15 18:57:17",
            updatedAt: "2024-09-15 18:57:17",
        }

        cy.intercept('GET', '/api/user/1', userInfo)

        // Click on Account button
        cy.get('[routerlink="me"]').click();

        const createdAtYear = userInfo.createdAt.slice(0,10).split("-")[0];
        const updatedAtYear = userInfo.updatedAt.slice(0,10).split("-")[0];
        const createdAtMonth = getMonthName(parseInt(userInfo.createdAt.slice(0,10).split("-")[1]));
        const updatedAtMonth = getMonthName(parseInt(userInfo.updatedAt.slice(0,10).split("-")[1]));
        const createdAtDay = parseInt(userInfo.createdAt.slice(0,10).split("-")[2]);
        const updatedAtDay = parseInt(userInfo.updatedAt.slice(0,10).split("-")[2]);

        // Verify user informations are visible
        cy.contains(`${userInfo.firstName} ${userInfo.lastName.toUpperCase()}`).should('be.visible');
        cy.contains(userInfo.email).should('be.visible');
        cy.contains(userInfo.admin ? "You are admin" : "").should('be.visible');
        cy.contains(`${createdAtMonth} ${createdAtDay}, ${createdAtYear}`).should('be.visible');
        cy.contains(`${updatedAtMonth} ${updatedAtDay}, ${updatedAtYear}`).should('be.visible');
    })

    it("Shows non admin user informations", () => {
        // Login mock
        cy.visit('/login');
        cy.intercept('POST', '/api/auth/login', {
            body: {
                id: 3,
                username: "toto3@toto.com",
                firstName: 'toto',
                lastName: 'toto',
                admin: false,
            }
        })

        cy.get('input[formControlName=email]').type("toto3@toto.com");
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);
        
        cy.url().should('include', '/sessions');
        
        const userInfo = {
            id: 3,
            email: "toto3@toto.com",
            lastName: "toto",
            firstName: "toto",
            admin: false,
            createdAt: "2024-09-06 18:04:48",
            updatedAt: "2024-09-06 18:04:49",
        }

        cy.intercept('GET', '/api/user/3', userInfo);

        // Click on Account button
        cy.get('[routerlink="me"]').click();

        const createdAtYear = userInfo.createdAt.slice(0,10).split("-")[0];
        const updatedAtYear = userInfo.updatedAt.slice(0,10).split("-")[0];
        const createdAtMonth = getMonthName(parseInt(userInfo.createdAt.slice(0,10).split("-")[1]));
        const updatedAtMonth = getMonthName(parseInt(userInfo.updatedAt.slice(0,10).split("-")[1]));
        const createdAtDay = parseInt(userInfo.createdAt.slice(0,10).split("-")[2]);
        const updatedAtDay = parseInt(userInfo.updatedAt.slice(0,10).split("-")[2]);
        
        // Verify user informations are visible
        cy.contains(`${userInfo.firstName} ${userInfo.lastName.toUpperCase()}`).should('be.visible');
        cy.contains(userInfo.email).should('be.visible');
        cy.contains(userInfo.admin ? "You are admin" : "Delete my account:").should('be.visible');
        cy.contains(`${createdAtMonth} ${createdAtDay}, ${createdAtYear}`).should('be.visible');
        cy.contains(`${updatedAtMonth} ${updatedAtDay}, ${updatedAtYear}`).should('be.visible');

        // Verify delete account button is visible for non admin user
        cy.get('button.mat-raised-button').should("be.visible");
        cy.get('.my2 > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').should("contain","delete");
        cy.get('.ml1').should("contain","Detail");
    })
})