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
    cy.visit("/schedule");
    cy.get(":nth-child(4) > :nth-child(3)").dblclick();
    cy.wait(1000)//bad practice, but we can't really fix the shedule interface...
    cy.get("input[placeholder=Title]").should("be.enabled").type("Test Event");
    cy.get('input[placeholder="Add description"]').should("be.enabled").type("Test Description");
    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("Test Event").click(); // check that the event is there
    cy.get(".Content-title").contains("Test Event"); // check that the title is correct
  });

  it("Create Event with wrong dates", () => {
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
    cy.visit("/schedule");
    cy.get(":nth-child(4) > :nth-child(3)").dblclick();
    cy.wait(500)//bad practice, but we can't really fix the shedule interface...
    cy.get("input[placeholder=Title]").should("be.enabled").type("Watch the cat");
    cy.get('input[placeholder="Add description"]').should("be.enabled").type("cat cat cat cat cat");
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("01/01/0000 12:00 am");
    cy.wait(1000)
    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div[data-cy=popup-title").contains("Start date after end date");
  });
});
