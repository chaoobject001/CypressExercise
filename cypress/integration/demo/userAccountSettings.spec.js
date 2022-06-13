import dayjs from "dayjs";

describe("User Account Settings", function () {
    before(() => {
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
        cy.contains("a", "Account Settings").click();
        cy.contains("a", "Account Settings").should("have.class", "active");
        cy.contains("div", "Account Settings").should("be.visible");
    })

    describe("Address book", function () {
        before(() => {
            cy.get("#edit-address-0").click();
        });

        it("should allow user update addressbook", function () {
            cy.intercept("PUT", "https://account-manager.lovevery.com/api/v1/addresses/*").as("addressUpdate");
            const timeStamp = dayjs().format("YYYY-MM-DD-HH-mm-ss"); 
            cy.fixture("contact").then((contact) => {
                for (var key in contact) {
                    if (contact.hasOwnProperty(key)) {
                        if (key === "last_name") {
                            cy.updateAddressField(key, contact[key] + " - " + timeStamp);
                        } else {
                            cy.updateAddressField(key, contact[key]);
                        }
                    }
                }
            });
            cy.get("#lovevery-address-form-submit").click();
            cy.contains("Address successfully updated").should("be.visible");
            cy.wait("@addressUpdate").then(({response}) => {
                assert.strictEqual(response.statusCode, 200)
                assert.strictEqual(response.body.last_name, `Bach - ${timeStamp}`)
            } );
        });

        it("validation warning on required fields with empty input", function () {
            const requiredFields = [ 
                "first_name", "last_name", "line1", "city", "zip_code"
            ];
            cy.fixture("contact").then((contact) => {
                for (var key in contact) {
                    if (contact.hasOwnProperty(key)) {
                        cy.emptyAddressField(key);
                    }
                }
            });
            cy.get("#lovevery-address-form-submit").click();
            
            cy.fixture("contact").then((contact) => {
                for (var key in contact) {
                    if (contact.hasOwnProperty(key) && requiredFields.includes(key)) {
                        cy.get(`#${key}`).parent().find(".error").should("contain.text", "Required");
                    }
                }
            });
            
        });
    });
})