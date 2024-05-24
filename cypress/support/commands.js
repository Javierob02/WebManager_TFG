// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (no_visit) => {
    cy.visit('/Login/login.html');
    cy.get('#username').click({force:true}).clear({force:true}).type('admin@f1fans.com', {force:true});
    cy.get('#password').click({force:true}).clear({force:true}).type('123456', {force:true});
    cy.get('#LoginBTN').click({force:true});
})

Cypress.Commands.add('loginIncorrect', (no_visit) => {
    cy.visit('/Login/login.html');
    cy.get('#username').click({force:true}).clear({force:true}).type('admin@f1fans.com', {force:true});
    cy.get('#password').click({force:true}).clear({force:true}).type('1234567', {force:true});
    cy.get('#LoginBTN').click({force:true});
})
