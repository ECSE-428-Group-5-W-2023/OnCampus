/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Update User Information", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);

    cy.visit("/");
  });

it("Update User Information", () => {
  //log in
  const userEmail = `e2e+${Math.ceil(
    Math.random() * 1000000000000000
  )}@testdfas.com`;
  cy.get(".w-full > .flex").click();
  cy.origin(
    "https://oncampus.us.auth0.com",
    { args: { userEmail } },
    ({ userEmail }) => {
      cy.get("a").contains("Sign up").click();
      cy.get("input#email").type(userEmail); // might have to go through signup every time and create a new account? might trigger the auth0 limits if we do that...
      cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
      cy.contains("button[value=default]", "Continue").click();
      cy.get("button").contains("Accept").click();
    }
  );

  // complete profile
  cy.visit("/account");
  cy.wait(5000);
  cy.get('#username').type('testUserName');
  cy.get('#name').type('testName');
  cy.get('#school').type('testSchool');
  cy.get('#bio').type('testBio');
  cy.get("button").contains("Submit").click();
  cy.url().should("include", "/account"); // check that at the correct url
  cy.get("div").contains("testUserName").click(); // check account info
  cy.get("div").contains("testName").click();
  cy.get("div").contains("testSchool").click();
  cy.get("div").contains("testBio").click();

  // edit account information
  cy.visit("/account");
  cy.get("button").contains("Edit").click();
  cy.wait(5000);
  cy.get('#username').type('testUserNameEdited');
  cy.get('#name').type('testNameEdited');
  cy.get('#school').type('testSchoolEdited');
  cy.get('#bio').type('testBioEdited');
  cy.get("button").contains("Submit Changes").click();
  cy.url().should("include", "/account"); // check that at the correct url
  cy.get("div").contains("testUserNameEdited").click(); // check account info
  cy.get("div").contains("testNameEdited").click();
  cy.get("div").contains("testSchoolEdited").click();
  cy.get("div").contains("testBioEdited").click();
  });

it("Complete User Information with Invalid Name (Numbers in Name)", () => {
  //log in
  const userEmail = `e2e+${Math.ceil(
    Math.random() * 1000000000000000
  )}@testdfas.com`;
  cy.get(".w-full > .flex").click();
  cy.origin(
    "https://oncampus.us.auth0.com",
    { args: { userEmail } },
    ({ userEmail }) => {
      cy.get("a").contains("Sign up").click();
      cy.get("input#email").type(userEmail); // might have to go through signup every time and create a new account? might trigger the auth0 limits if we do that...
      cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
      cy.contains("button[value=default]", "Continue").click();
      cy.get("button").contains("Accept").click();
    }
  );

  // complete profile with numbers in name
  cy.visit("/account");
  cy.wait(5000);
  cy.get('#username').type('testUserName');
  cy.get('#name').type('testName123');
  cy.get('#school').type('testSchool');
  cy.get('#bio').type('testBio');
  cy.get("button").contains("Submit").click();
  cy.url().should("include", "/account"); // check that at the correct url
  cy.get("div[data-cy=popup-title").contains("Invalid Name"); //check that pop up appears
  });

it("Complete User Information with Invalid Name (Special Character in Name)", () => {
  //log in
  const userEmail = `e2e+${Math.ceil(
    Math.random() * 1000000000000000
  )}@testdfas.com`;
  cy.get(".w-full > .flex").click();
  cy.origin(
    "https://oncampus.us.auth0.com",
    { args: { userEmail } },
    ({ userEmail }) => {
      cy.get("a").contains("Sign up").click();
      cy.get("input#email").type(userEmail); // might have to go through signup every time and create a new account? might trigger the auth0 limits if we do that...
      cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
      cy.contains("button[value=default]", "Continue").click();
      cy.get("button").contains("Accept").click();
    }
  );

  // complete profile
  cy.visit("/account");
  cy.wait(5000);
  cy.get('#username').type('testUserName');
  cy.get('#name').type('testName');
  cy.get('#school').type('testSchool');
  cy.get('#bio').type('testBio');
  cy.get("button").contains("Submit").click();
  cy.url().should("include", "/account"); // check that at the correct url
  cy.get("div").contains("testUserName").click(); // check account info
  cy.get("div").contains("testName").click();
  cy.get("div").contains("testSchool").click();
  cy.get("div").contains("testBio").click();

  // edit account information and put special character in name
  cy.visit("/account");
  cy.get("button").contains("Edit").click();
  cy.wait(5000);
  cy.get('#username').type('testUserNameEdited');
  cy.get('#name').type('test_Name');
  cy.get('#school').type('testSchool');
  cy.get('#bio').type('testBioEdited');
  cy.get("button").contains("Submit Changes").click();
  cy.url().should("include", "/account"); // check that at the correct url
  cy.get("div[data-cy=popup-title").contains("Invalid Name"); //check that pop up appears
  });
});