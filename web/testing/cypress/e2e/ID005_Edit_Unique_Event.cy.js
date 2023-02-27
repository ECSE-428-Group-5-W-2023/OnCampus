/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Edit Unique Events", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);

    cy.visit("/");
  });

it("Edit Event", () => {
  //log in
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

  //create an unique event
  cy.visit("/schedule");
  cy.get(":nth-child(5) > :nth-child(2)").dblclick();
  cy.get("input[placeholder=Title]").type("Test", { force: true }).should('have.value', 'Test');
  cy.get('input[placeholder="Add description"]').type("D", { force: true });
  cy.get("button").contains("Save").click();
  cy.url().should("include", "/schedule"); // check that at the correct url

  cy.contains("Test").click();
  cy.get("button").get("svg").get('[data-testid^=EditIcon]').click();
  console.log("Edit Icon clicked");
  cy.get("input[placeholder=Title]").type("Update", { force: true }).should('have.value', 'TestUpdate');
  cy.get('input[placeholder="Add description"]').type("U", { force: true }).should('have.value', 'DU');

  cy.get('input[value="06/02/2023 08:30 AM"]').clear().type("06/02/2023 09:30 AM", { force: true }); //edit time 
  cy.get("button").contains("Save").click();
  cy.url().should("include", "/schedule"); // check that at the correct url
  cy.get("div").contains("TestUpdate").click(); // check that the event is there
  cy.get(".Content-title").contains("TestUpdate"); // check that the title is correct
  });

});
