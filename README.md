### Background
This is the demo app that showcase a Cypress exercise.

### System behaviors under test
1. Sign In with user details below
2. Change User’s Profile Info, Contact Details, Name (Edit - First & Last)
3. Change User’s Profile Info, Child Details, Name (Edit - Name)
4. Change User’s Account Settings, Address Book, (Edit - All Fields)

### Test case design and other possible direction for test coverage 
Ideally test automation should cover positive test case scenario first to ensure the value of feture under test, assuming the system behavior is stable and can be drived by automation tool like cypress or scripting language. I choose to cover positive first in login feature as described in scetion above. Since login feature is required by the rest feature and has relatively less variables (email / password), I tried to covered more with both paitive and negative test scenarios. While this is not exhaustive testing, it hinted on the direction I would likely to take in negative scenarios in other spec files if I were to implement them. 

For Profile Info, I cover both scenarios (Contact Details / Child Details) in one spec file as they are closer to each other, at least in UI layout. This provide more posibility to share common utilty functions.

For Account Settings, I cover positive test case and one negative test case to catch all empty fields validation. I did some additional exploratory test and recorded my findings in section (Bug reports) below. 

### Credential
Test fixture secrets.json can be injected by CI/CD pipeline to secure test credentials. 
To execute test locally, please create cypress\fixtures\secrets.json with following content
```
{
    "email": {your test email in string},
    "password": {your password in string}
}
```

### Test execution
1. Run test in headless mode: yarn cy:run
2. Run test with browser: yarn cy:open  

### Test Retries
1. Test case will be executed up to 2 times in headless mode (yarn cy:run) before considered as fail
2. Test case will be executed up to 3 times in browser (yarn cy:open) before considered as fail 

### Bug reports
1. Cypress event: "uncaught:exception" is ignored by
Cypress.on("uncaught:exception", (err, runnable) => { return false; });
in this test suite until following 
possible Uncaught TypeError(s) are resolved:
- Cannot read properties of undefined (reading 'length')
- DIGIOH: Custom JS Parent -- Cannot read properties of undefined (reading 'push')

2. Long login session - login for over 24 hours without token expiration

3. https://lovevery.com/account/login may not be secure due to invalid certificate


3. This was discovered during profile info update / address update: duplicated id "lov-alert" for both success / error message 
   - id should be unique

4. Issues within user account settings page (fields referenced by css selector)
    - #phone_number takes characters (normal and special) instead of number as valid input
    
    - #city takes digits as valid input (this may or may not be by design) 
    
    - #line1 takes empty string as input then produce error message "Error updating address"
    from [Network error]: Error: Response not successful: Received status code 400

    - #first_name and #last_name takes empty string " " (and special characters) as valid input

5. Some test automation have issue with system since I am receiving error for
   https://account-manager.lovevery.com/api/v1/users/check_migrate 418 (I'm a Teapot)
   Some websites use this response for requests they do not wish to handle, 
   such as automated queries.





