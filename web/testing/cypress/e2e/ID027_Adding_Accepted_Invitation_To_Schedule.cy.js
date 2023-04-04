/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Unfriend Another User", () => {
    
  beforeEach(() => {
      cy.viewport(1440, 900);
      cy.visit("/");
  });
  
  it("Delete a user from friend list when logged in (Normal Flow)", () => {
    
    // log in
    const userEmail = `e2e+${Math.ceil(
      Math.random() * 1000000000000000
    )}@testdfas.com`;
    console.log(userEmail);
    cy.get(".w-full > .flex").click();
    cy.origin(
      "https://oncampus.us.auth0.com",
      { args: { userEmail } },
      ({ userEmail }) => {
        cy.get("a").contains("Sign up").click();
        cy.get("input#email").type(userEmail); //me might have to go through signup every time and create a new account? might trigger the auth0 limits if we do that...
        cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
        cy.contains("button[value=default]", "Continue").click();
        cy.get("button").contains("Accept").click();
      }
    );
    
    // user that will create a group where he will add shared events
    cy.visit("/account");
    cy.wait(500);
    const username = userEmail.substring(0, userEmail.indexOf('@'));
    cy.get('#username').type(username);
    cy.get('#name').type('name');
    cy.get('#school').type('school');
    cy.get('#bio').type('bio');
    cy.get("button").contains("Submit").click();

    // Create a group
    cy.visit("/friendgroup");
    cy.wait(2000);
    cy.get("#groupName").type('ECSE');
    cy.get('#groupDescription').type('ECSE group');
    cy.get("button").contains("Create").click();

    // log out
    cy.get("button").contains("Log Out").click();

    // main user signs up
    const userEmail2 = `e2e+${Math.ceil(
      Math.random() * 1000000000000000
    )}@testdfas.com`;
    cy.get("button").contains("Log In").click();
    cy.origin(
      "https://oncampus.us.auth0.com",
      { args: { userEmail2 } },
      ({ userEmail2 }) => {
        cy.get("a").contains("Sign up").click();
        cy.get("input#email").type(userEmail2);
        cy.get("input#password").type("#e5PUJe9@mrol$", { log: false });
        cy.contains("button[value=default]", "Continue").click();
        cy.get("button").contains("Accept").click();
      }
    );
  
    // complete profile of main user
    cy.visit("/account");
    cy.wait(500);
    const username2 = userEmail2.substring(0, userEmail2.indexOf('@'));
    cy.get('#username').type(username2);
    cy.get('#name').type('name');
    cy.get('#school').type('mcgill');
    cy.get('#bio').type('i will join a group');
    cy.get("button").contains("Submit").click();
    cy.wait(1000);

    // join a group
    cy.visit("/friendgroup");
    cy.get(".friend-group > div > input").click();
    cy.get(".py-1 li:first-child").click();

    // assert that was successfully added to the group
    cy.get("div").contains("ECSE");
    
    // check that it was added to the schedule
    cy.visit("/schedule");
    cy.get("button").contains("ECSE").click();

  }); 
});