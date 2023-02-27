/* eslint-disable no-undef */
/// <reference types="cypress" />

import Chance from 'chance'
const chance = new Chance();

describe("User Authentication", () => {

    beforeEach(() => {
      cy.viewport(1440, 900); 
      cy.visit("http://localhost:9241");
    });

    it("Log in", () => {
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

it("Log out", () => {
    // log in again
    const email = chance.email();
    console.log(email);
    cy.get(".w-full > .flex").click();
    cy.origin("https://oncampus.us.auth0.com", { args:{email} }, ({email}) => {
    cy.get("a").contains("Sign up").click();
    cy.get("input#email").type(email); 
    cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
    cy.contains("button[value=default]", "Continue").click();
    cy.get("button").contains("Accept").click(); });
    //logout
    cy.get(".flex > .w-full").click();
    cy.get(".flex > .hidden").contains("Log In"); // check that there is now a log in button

});

    
});