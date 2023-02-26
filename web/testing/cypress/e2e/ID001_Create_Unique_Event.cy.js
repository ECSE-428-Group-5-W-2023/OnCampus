/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Basic app navigation", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);

    cy.visit("/");
  });

  it("Create Event", () => {
    const userEmail = `e2e+${Math.ceil(
      Math.random() * 1000000000000000
    )}@testdfas.com`;
    console.log(userEmail);
    cy.get(".w-full > .flex").click();
    cy.origin("https://oncampus.us.auth0.com", { args:{userEmail} }, ({userEmail}) => {
      cy.get("a").contains("Sign up").click();
      cy.get("input#email").type(userEmail); //me might have to go through signup every time and create a new account? might trigger the auth0 limits if we do that...
      cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
      cy.contains("button[value=default]", "Continue").click();
      cy.get("button").contains("Accept").click();
    });
    cy.visit("/schedule");
    cy.get(":nth-child(5) > :nth-child(2)").dblclick();
    cy.get("input[placeholder=Title]").type("Test Event");
    cy.get("textarea[placeholder=Notes]").type("Test Description");
    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("Test Event").click(); // check that the event is there
    cy.get(".Content-title").contains("Test Event"); // check that the title is correct
  });
});
