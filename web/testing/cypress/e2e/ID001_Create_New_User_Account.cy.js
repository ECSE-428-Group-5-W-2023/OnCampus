/* eslint-disable no-undef */
/// <reference types="cypress" />

import Chance from 'chance'
const chance = new Chance();

describe("User Authentication", () => {

    beforeEach(() => {
      cy.viewport(1440, 900); 
      cy.visit("/");
    });

    it("Create an account", () => {
      const email = chance.email();
      console.log(email);
      cy.get(".w-full > .flex").click();
      cy.origin("https://oncampus.us.auth0.com", { args:{email} }, ({email}) => {
      cy.get("a").contains("Sign up").click();
      cy.get("input#email").type(email);
      cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
      cy.contains("button[value=default]", "Continue").click();
      cy.get("button").contains("Accept").click();
})});

it("Email Already in Use", () => {
  // log in again
  const email = chance.email();
  console.log(email);
  cy.get(".w-full > .flex").click();
  cy.origin("https://oncampus.us.auth0.com", { args:{email} }, ({email}) => {
  cy.get("a").contains("Sign up").click();
  cy.get("input#email").type(email); 
  cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
  cy.contains("button[value=default]", "Continue").click();
  cy.get("button").contains("Accept").click(); 
});
  //logout
  cy.get("button").contains("Log Out").click();
  cy.get(".flex > .hidden").contains("Log In"); // check that there is now a log in button
  // try to log to create a new account
  // create a new account
  console.log(email);
  cy.get(".w-full > .flex").click();
  cy.origin("https://oncampus.us.auth0.com", { args:{email} }, ({email}) => {
  cy.get("a").contains("Sign up").click();
  cy.get("input#email").type(email); 
  cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
  cy.contains("button[value=default]", "Continue").click();
  // check for the error message
  cy.get("#prompt-alert")
})});

it("Email not entered", () => {
  // create an account
  const email = chance.email();
  console.log(email);
  cy.get(".w-full > .flex").click();
  cy.origin("https://oncampus.us.auth0.com", { args:{email} }, ({email}) => {
  cy.get("a").contains("Sign up").click(); // enter password only
  cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
  cy.contains("button[value=default]", "Continue").click();
  cy.contains("button[value=default]", "Continue") // check that the form was not submitted
})
});

it("Password not entered", () => {
  // create an account
  const email = chance.email();
  console.log(email);
  cy.get(".w-full > .flex").click();
  cy.origin("https://oncampus.us.auth0.com", { args:{email} }, ({email}) => {
  cy.get("a").contains("Sign up").click(); 
  cy.get("input#email").type(email); // enter email only
  cy.contains("button[value=default]", "Continue").click();
  cy.contains("button[value=default]", "Continue") // check that the form was not submitted
})
});
    

});