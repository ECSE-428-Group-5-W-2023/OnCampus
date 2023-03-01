/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Display schedule", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);

    cy.visit("/");
  });

  it("Display own schedule", () => {
    //sign up and log in to account A
    const userEmail = `e2e+${Math.ceil(
      Math.random() * 1000000000000000
    )}@testdfas.com`;
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

    //create event A
    cy.visit("/schedule");
    cy.wait(2000);
    cy.get(":nth-child(5) > :nth-child(2)").dblclick();
    cy.get("input[placeholder=Title]").type("Event A");
    cy.get('input[placeholder="Add description"]').type("Event A Description");
    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("Event A").click(); // check that the event is there
    cy.get(".Content-title").contains("Event A"); // check that the title is correct

    //log out and log in
    cy.contains("Log Out").closest("button").click({ force: true });
    cy.wait(2000);
    cy.contains("Log In").closest("button").click({ force: true });
    cy.wait(2000);
    cy.origin(
      "https://oncampus.us.auth0.com",
      { args: { userEmail } },
      ({ userEmail }) => {
        cy.get("#username").type(userEmail); //me might have to go through signup every time and create a new account? might trigger the auth0 limits if we do that...
        cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
        cy.contains("button[value=default]", "Continue").click();
      }
    );

    //check if event A is displayed
    cy.visit("/schedule");
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("Event A").click(); // check that the event is there
    cy.get(".Content-title").contains("Event A"); // check that the title is correct
  });
});
