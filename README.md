### Background

This is the demo app that showcase a Cypress exercise.

### Test Steps

1. Navigate to https://demoblaze.com
2. Click signup and create a new account
3. Login to your account
4. Add 'Samsung Galaxy S6" to your cart
5. Navigate to the cart, and verify that you have the correct phone model

### Credential
Test fixture secrets.json can be injected by CI/CD pipeline to secure test credentials 

### Test execution
1. Run test in headless mode: npm run cy:run
2. Run test with browser: npm run cy:open

### Test Retries
1. Test case will be executed up to 2 times in headless mode (npm run cy:run) before considered as fail
2. Test case will be executed up to 3 times in browser (npm run cy:open) before considered as fail 