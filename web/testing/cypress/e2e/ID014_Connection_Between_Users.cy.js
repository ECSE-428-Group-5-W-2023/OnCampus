/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Connection between users", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    cy.visit("/");
  });

it("Search Friend With Correct Username And then Incorrect Username", () => {
  // log in of first user
  const userEmail1 = `e2e+${Math.ceil(
    Math.random() * 1000000000000000
  )}@testdfas.com`;
  cy.get(".w-full > .flex").click();
  cy.origin(
    "https://oncampus.us.auth0.com",
    { args: { userEmail1 } },
    ({ userEmail1 }) => {
      cy.get("a").contains("Sign up").click();
      cy.get("input#email").type(userEmail1); // might have to go through signup every time and create a new account? might trigger the auth0 limits if we do that...
      cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
      cy.contains("button[value=default]", "Continue").click();
      cy.get("button").contains("Accept").click();
    }
  );

  // complete profile of first user
  cy.visit("/account");
  cy.wait(5000);
  cy.get('#username').type('friendUsername');
  cy.get('#name').type('friendName');
  cy.get('#school').type('friendSchool');
  cy.get('#bio').type('friendBio');
  cy.get("button").contains("Submit").click();

  // log out of first user
  cy.get("button").contains("Log Out").click();

  // log in of second user
  const userEmail2 = `e2e+${Math.ceil(
    Math.random() * 1000000000000000
  )}@testdfas.com`;
  cy.get(".w-full > .flex").click();
  cy.origin(
    "https://oncampus.us.auth0.com",
    { args: { userEmail2 } },
    ({ userEmail2 }) => {
      cy.get("a").contains("Sign up").click();
      cy.get("input#email").type(userEmail2); // might have to go through signup every time and create a new account? might trigger the auth0 limits if we do that...
      cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
      cy.contains("button[value=default]", "Continue").click();
      cy.get("button").contains("Accept").click();
    }
  );

  // complete profile of second user
  cy.visit("/account");
  cy.wait(5000);
  cy.get('#username').type('friendUsername');
  cy.get('#name').type('myName');
  cy.get('#school').type('mySchool');
  cy.get('#bio').type('myBio');
  cy.get("button").contains("Submit").click();

  // Search Friend With Correct Username (Normal Flow)
  cy.visit("/friendship");
  cy.get('input[type="text"]').click()
  cy.contains('friendUsername (friendName)').click()
  cy.wait(5000);
  cy.get("div").contains("friendUsername").click(); // check friend's account info
  cy.get("div").contains("friendName").click();
  cy.get("div").contains("friendSchool").click();
  cy.get("div").contains("friendBio").click();

  // Search Friend With Incorrect Username (Error Flow)
  cy.get('input[type="text"]').clear().type('wrongUsername')
  cy.get('div').should('not.contain', 'li') // check if there is no friend with that username
  });
});