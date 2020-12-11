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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (username, password) => { 
    cy.get("#login2").click();
    cy.get(".modal-content").should("be.visible");
    cy.get("#loginusername").invoke("val", username)
        .should("have.value", username);
    cy.get("#loginpassword").invoke("val", password);
    cy.contains("button", "Log in").click();
    cy.get(".modal-content").should("not.be.visible");
})
