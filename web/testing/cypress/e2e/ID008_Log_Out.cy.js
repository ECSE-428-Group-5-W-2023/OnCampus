/* eslint-disable no-undef */
/// <reference types="cypress" />

import Chance from 'chance'
const chance = new Chance();

describe("Log out from account", () => {

    const email = chance.email();
    const password = "#e5PUJe9@mroL$"
    
  before(() => {
      cy.viewport(1440, 900); 
      cy.visit("/");
      // create an account and login
      console.log(email);
      cy.get(".w-full > .flex").click();
      cy.origin("https://oncampus.us.auth0.com", { args:{email, password} }, ({email, password}) => {
      cy.get("a").contains("Sign up").click();
      cy.get("input#email").type(email);
      cy.get("input#password").type( password, { log: false });
      cy.contains("button[value=default]", "Continue").click();
      cy.get("button").contains("Accept").click();
    })
    //logout
    cy.get("button").contains("Log Out").click();
  })

    beforeEach(() => {
      cy.viewport(1440, 900); 
      cy.visit("/");
      // log in again
      cy.get("button").contains("Log In").click();
      cy.origin("https://oncampus.us.auth0.com", { args:{email, password} }, ({email, password}) => {
      cy.get("input#username").type(email);
      cy.get("input#password").type(password, { log: false });
      cy.contains("button[value=default]", "Continue").click();
    })
  });

    it("Log out", () => {
      //logout
      cy.get("button").contains("Log Out").click();
      cy.get("button").contains("Log In") // check for Log In button
  
  });

});