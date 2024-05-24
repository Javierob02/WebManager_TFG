describe('Login Tests', () => {

  it('Correct Login', () => {
    cy.login();
    cy.contains('DB Manager').should('be.visible');
    cy.contains('Invalid Credentials').should('not.exist');

    cy.get('#Drivers').should('be.visible');
    cy.get('#Teams').should('be.visible');
    cy.get('#Circuits').should('be.visible');
    cy.get('#News').should('be.visible');
    cy.get('#ChatUsers').should('be.visible');
    cy.get('#ChatMessages').should('be.visible');
    cy.get('#Test').should('be.visible');
  })

  it('Incorrect Login', () => {
    cy.loginIncorrect();
    cy.contains('DB Manager').should('not.exist');
    cy.contains('Invalid Credentials').should('be.visible');

    cy.get('#Drivers').should('not.exist');
    cy.get('#Teams').should('not.exist');
    cy.get('#Circuits').should('not.exist');
    cy.get('#News').should('not.exist');
    cy.get('#ChatUsers').should('not.exist');
    cy.get('#ChatMessages').should('not.exist');
    cy.get('#Test').should('not.exist');
  })

  it('Login & LogOut', () => {
    cy.login();
    cy.contains('DB Manager').should('be.visible');
    cy.contains('Invalid Credentials').should('not.exist');

    cy.get('#logoutBTN').click({force:true});
    cy.contains('DB Manager').should('not.exist');
    cy.contains('Login Here').should('be.visible');
  })
})