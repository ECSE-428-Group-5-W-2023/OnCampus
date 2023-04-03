/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Responding to Friend Requests", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    cy.visit("/");
  });

it("Accept Friend Request", () => {
  // main user signs up
  const userEmail1 = `e2e+${Math.ceil(
    Math.random() * 1000000000000000
  )}@testdfas.com`;
  cy.get(".w-full > .flex").click();
  cy.origin(
    "https://oncampus.us.auth0.com",
    { args: { userEmail1 } },
    ({ userEmail1 }) => {
      cy.get("a").contains("Sign up").click();
      cy.get("input#email").type(userEmail1);
      cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
      cy.contains("button[value=default]", "Continue").click();
      cy.get("button").contains("Accept").click();
    }
  );

  // complete profile of main user
  cy.visit("/account");
  cy.wait(5000);
  const username = userEmail1.substring(0, userEmail1.indexOf('@'));
  cy.get('#username').type(username);
  cy.get('#name').type('name');
  cy.get('#school').type('school');
  cy.get('#bio').type('bio');
  cy.get("button").contains("Submit").click();

  // main user logs out
  cy.get("button").contains("Log Out").click();

  // potential friend signs up
  const userEmail2 = `e2e+${Math.ceil(
    Math.random() * 1000000000000000
  )}@testdfas.com`;
  cy.get(".w-full > .flex").click();
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

  // complete profile of potential friend
  cy.visit("/account");
  cy.wait(5000);
  cy.get('#username').type('friendUsername');
  cy.get('#name').type('friendName');
  cy.get('#school').type('friendSchool');
  cy.get('#bio').type('friendBio');
  cy.get("button").contains("Submit").click();

  // sending friend request to main user
  cy.visit("/friendship");
  cy.get('input[type="text"]').type(username);
  cy.get('ul').find('li:first-child').click();
  cy.wait(2000);
  cy.get("button").contains("Request Friend!").click();
  cy.wait(5000);

  // potential friend logs out
  cy.get("button").contains("Log Out").click();

  // main user logs in
  cy.get(".w-full > .flex").click();
  cy.origin(
    "https://oncampus.us.auth0.com",
    { args: { userEmail1 } },
    ({ userEmail1 }) => {
      cy.get("input#username").type(userEmail1);
      cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
      cy.contains("button[value=default]", "Continue").click();
    }
  );

  // main user checks friend request
  cy.visit("/friendrequests");
  cy.wait(5000);
  // check if friend's account info is there
  cy.get("div").contains(userEmail1);
  cy.get("div").contains("friendName");
  cy.get("div").contains("friendSchool");
  cy.get("div").contains("friendBio");
  cy.get("button").contains("Accept").click(); // accept friend request
  cy.wait(5000);
  // check if friend's account info is gone
  cy.get('div')
    .not(':contains(${userEmail1})')
    .not(':contains("friendName")')
    .not(':contains("friendSchool")')
    .not(':contains("friendBio")');
  cy.wait(5000);
  });

it("Decline Friend Request", () => {
  // main user signs up
  const userEmail1 = `e2e+${Math.ceil(
    Math.random() * 1000000000000000
  )}@testdfas.com`;
  cy.get(".w-full > .flex").click();
  cy.origin(
    "https://oncampus.us.auth0.com",
    { args: { userEmail1 } },
    ({ userEmail1 }) => {
      cy.get("a").contains("Sign up").click();
      cy.get("input#email").type(userEmail1);
      cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
      cy.contains("button[value=default]", "Continue").click();
      cy.get("button").contains("Accept").click();
    }
  );

  // complete profile of main user
  cy.visit("/account");
  cy.wait(5000);
  const username = userEmail1.substring(0, userEmail1.indexOf('@'));
  cy.get('#username').type(username);
  cy.get('#name').type('name');
  cy.get('#school').type('school');
  cy.get('#bio').type('bio');
  cy.get("button").contains("Submit").click();

  // main user logs out
  cy.get("button").contains("Log Out").click();

  // potential friend signs up
  const userEmail2 = `e2e+${Math.ceil(
    Math.random() * 1000000000000000
  )}@testdfas.com`;
  cy.get(".w-full > .flex").click();
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

  // complete profile of potential friend
  cy.visit("/account");
  cy.wait(5000);
  cy.get('#username').type('friendUsername');
  cy.get('#name').type('friendName');
  cy.get('#school').type('friendSchool');
  cy.get('#bio').type('friendBio');
  cy.get("button").contains("Submit").click();

  // sending friend request to main user
  cy.visit("/friendship");
  cy.get('input[type="text"]').type(username);
  cy.get('ul').find('li:first-child').click();
  cy.wait(2000);
  cy.get("button").contains("Request Friend!").click();
  cy.wait(5000);

  // potential friend logs out
  cy.get("button").contains("Log Out").click();

  // main user logs in
  cy.get(".w-full > .flex").click();
  cy.origin(
    "https://oncampus.us.auth0.com",
    { args: { userEmail1 } },
    ({ userEmail1 }) => {
      cy.get("input#username").type(userEmail1);
      cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
      cy.contains("button[value=default]", "Continue").click();
    }
  );

  // main user checks friend request
  cy.visit("/friendrequests");
  cy.wait(5000);
  // check if friend's account info is there
  cy.get("div").contains(userEmail1);
  cy.get("div").contains("friendName");
  cy.get("div").contains("friendSchool");
  cy.get("div").contains("friendBio");
  cy.get("button").contains("Decline").click(); // decline friend request
  cy.wait(5000);
  // check if friend's account info is gone
  cy.get('div')
    .not(':contains(${userEmail1})')
    .not(':contains("friendName")')
    .not(':contains("friendSchool")')
    .not(':contains("friendBio")');
  cy.wait(5000);
  });
});