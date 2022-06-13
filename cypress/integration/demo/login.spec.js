describe("Login", function () {
    before(() => {
        // Issue to be addressed: Uncaught TypeError: Cannot read properties of undefined (reading 'length') 
        Cypress.on("uncaught:exception", (err, runnable) => {
            return false;
        });
    })

    describe("Positive scenarios", function () {
        it("should allow user to login from homepage", function () {
            const redirectedURLs = [];
            cy.on("url:changed", newUrl => {
                redirectedURLs.push(newUrl);
            });
            cy.intercept("/apps/loggedincustomer").as("loggedincustomer");
            cy.intercept("/account").as("getAccountPage");

            cy.visit("/");
            cy.get(".menu-sign-in").should("exist").click();
            cy.location("pathname", {timeout: 10000})
                .should("include", "/account/login")
                .then(() => {
                    assert.deepStrictEqual(redirectedURLs, ["https://lovevery.com/", "https://lovevery.com/account/login"]);
                });

            cy.fixture("secrets").then((secrets) => {
                cy.get("#email").type(secrets.email);
                cy.get("#password").type(secrets.password);
                cy.get("#form-submit-button").click();
            });
            cy.wait("@loggedincustomer", {responseTimeout: 60000});
            cy.wait("@getAccountPage", {responseTimeout: 60000});
            cy.title().should("eq", "Account – Lovevery");
        });

        it("should allow user to login directly from login page", function () {
            cy.fixture("secrets").then((secrets) => {
                cy.login(secrets.email, secrets.password);
            });
            cy.title().should("eq", "Account – Lovevery");
        });
    });

    describe("Negative scenarios", function () {
        it("should prevent user from login with invalid credential", function () {
            cy.fixture("secrets").then(() => {
                cy.login("invlid@Email.com", "password")
            });
            cy.title().should("not.eq", "Account – Lovevery");
            cy.get("#CustomerLoginForm").should("contain.text", "Account does not exist.");
        });

        it("should prevent user from login with invalid email format", function () {
            cy.fixture("secrets").then(() => {
                cy.login("invlidFormat", "password")
            });
            cy.title().should("not.eq", "Account – Lovevery");
            cy.contains("label", "Email Address").parent().should("contain.text", "Invalid email address");        
        });

        it("should prevent user from login with wrong password", function () {
            cy.fixture("secrets").then((secrets) => {
                cy.login(secrets.email, "password")
            });
            cy.title().should("not.eq", "Account – Lovevery");
            cy.get("#CustomerLoginForm").should("contain.text", "Incorrect username or password.");
        });
    });
})