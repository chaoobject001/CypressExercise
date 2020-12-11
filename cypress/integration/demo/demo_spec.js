describe("Demo", function () {
    before(() => {
        const timeStamp = Cypress.moment().format('MMDDhhmmss');
        const freshUsername = `user${timeStamp}`;
        cy.wrap(`${freshUsername}`).as("freshUsername");
    })

    beforeEach(() => {
        cy.visit("https://demoblaze.com");
        cy.title().should("equal", "STORE"); 
    })

    describe("Account Creation", function () {
        it("should signup and create a new account", function () {
            cy.get("#signin2").click();
            cy.get(".modal-content").should("be.visible");

            cy.get("#sign-username").invoke("val", this.freshUsername)
                .should("have.value", this.freshUsername); 
            
            cy.fixture("secrets").then((secrets) => {
                cy.get("#sign-password").invoke("val", secrets.Password);
            })
                     
            cy.contains("button", "Sign up").click();

            cy.get(".modal-content").should("not.be.visible");

            cy.on('window:alert', (str) => {
                expect(str).to.equal("Sign up successful.")
            })

        })
    })

    describe("Login", function () {
        it("should login to an existing account", function () {   
            cy.fixture("secrets").then((secrets) => {
                cy.login(this.freshUsername, secrets.Password)
            })
            cy.get("#nameofuser").should("contain", this.freshUsername);          
        })
    })

    describe("Cart", function () {
        it("should add expected item to cart", function () {
            cy.fixture("secrets").then((secrets) => {
                cy.login(this.freshUsername, secrets.Password)
            })

            // Add 'Samsung Galaxy S6" to your cart
            cy.contains("a", "Samsung galaxy s6").should("be.visible")
                .click();
            
            cy.server()
            cy.route("POST", "/view").as("view");

            cy.wait("@view").then(() => {
                cy.get("#tbodyid h2").should("contain", "Samsung galaxy s6");
            });
            cy.contains(".btn-success", "Add to cart").click()
                .then(() => {
                    cy.on('window:alert', (str) => {
                        expect(str).to.equal("Product added.")
                    })
                })

            // Navigate to the cart, and verify that you have the correct phone model
            cy.get("#cartur").click();
            cy.get("tr.success").should("contain", "Samsung galaxy s6");
        })
    })
})