import dayjs from "dayjs";

describe("User Profile", function () {
    beforeEach(() => {
        // Issue to be addressed: Uncaught TypeError: Cannot read properties of undefined (reading 'length') 
        Cypress.on("uncaught:exception", (err, runnable) => {
            return false;
        });
        cy.intercept("/apps/loggedincustomer").as("loggedincustomer");
        cy.intercept("/account").as("getAccountPage");
        cy.fixture("secrets").then((secrets) => {
            cy.login(secrets.email, secrets.password);
        });

        cy.wait("@loggedincustomer", {responseTimeout: 60000});
        cy.wait("@getAccountPage", {responseTimeout: 60000});
        cy.contains("a", "Profile Info").click();
        cy.contains("a", "Profile Info").should("have.class", "active");
    })

    context("Contact Details", function () {
        it("should allow user to update first name and last name", function () {
            cy.get("#edit-contact-details").click();
            cy.intercept("PUT", "https://account-manager.lovevery.com/api/v1/users/*").as("userUpdate");
            const timeStamp = dayjs().format("YYYY-MM-DD-HH-mm-ss");
            cy.fixture("contact").then((contact) => {

                cy.get("#lovfield-first_name").clear().type(`${contact.first_name}`);
                cy.get("#lovfield-last_name").clear().type(`${contact.last_name} - ${timeStamp}`);
            });

            cy.get("#user-details-submit").click();
            cy.contains("Profile info successfully updated").should("be.visible");
            cy.wait("@userUpdate").then(({response}) => {
                assert.strictEqual(response.statusCode, 200)
                assert.strictEqual(response.body.last_name, `Bach - ${timeStamp}`)
            } );
        });
    });

    context("Child Details", function () {
        it("should allow user to update child name", function () {
            cy.get("#child-0-edit").click();
            cy.intercept("PUT", "https://account-manager.lovevery.com/api/v1/children/*").as("childrenUpdate");
            const timeStamp = dayjs().format("YYYY-MM-DD-HH-mm-ss");

            cy.updateAddressField("lovfield-name", `Bach Jr - ${timeStamp}`);

            cy.get("#child-details-submit").click();
            cy.wait("@childrenUpdate").then(({response}) => {
                assert.strictEqual(response.statusCode, 201);
                assert.strictEqual(response.body.name, `Bach Jr - ${timeStamp}`)
            } );
        });
    });
})