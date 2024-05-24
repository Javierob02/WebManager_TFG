describe('DB Manager Tests', () => {
  it('Add Record', () => {
    cy.login();

    cy.get('#Test').click({force:true});
    cy.wait(100);
    cy.get('#addBTN').click({force:true});

    cy.get('#Nombre').click({force:true}).clear({force:true}).type('TestCypress', {force:true});
    cy.get('#Numero').click({force:true}).clear({force:true}).type('1234', {force:true});

    cy.get('#AddRecordBTN').click({force:true});

    cy.contains('TestCypress').should('be.visible');
    cy.contains('1234').should('be.visible');
  });

  it('Modify Record', () => {
    cy.login();

    cy.get('#Test').click({force:true});
    cy.wait(100);
    cy.contains('TestCypress').parent().find('td').last().find('span').first().click({force:true});

    cy.get('#Nombre').click({force:true}).clear({force:true}).type('MODIFICADOTestCypress', {force:true});
    cy.get('#Numero').click({force:true}).clear({force:true}).type('5678', {force:true});

    cy.get('#EditRecordBTN').click({force:true});

    cy.contains('MODIFICADOTestCypress').should('be.visible');
    cy.contains('5678').should('be.visible');
  });

  it('Delete Record', () => {
    cy.login();

    cy.get('#Test').click({force:true});
    cy.wait(100);
    cy.contains('TestCypress').parent().find('td').last().find('span').last().click({force:true});

    cy.get('#deleteButton').click({force:true});

    cy.contains('MODIFICADOTestCypress').should('not.exist');
    cy.contains('5678').should('not.exist');
  });
})