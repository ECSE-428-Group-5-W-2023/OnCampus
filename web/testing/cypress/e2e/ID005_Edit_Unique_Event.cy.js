/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Edit Unique Events", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);

    cy.visit("/");
  });

it("Edit an unique event", () => {
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

  //create volunteer event
  cy.visit("/schedule");
  cy.get(":nth-child(5) > :nth-child(2)").dblclick();
  cy.get("input[placeholder=Title]").type("Volunteer", { force: true }).should('have.value', 'Volunteer');
  cy.get('input[placeholder="Add description"]').type("D", { force: true });
  cy.get('input[value="06/02/2023 08:00 AM"]').click().clear().type("06/02/2023 09:00 AM", {delay: 100}, { force: true }); //edit time 
  cy.get('input[value="06/02/2023 08:30 AM"]').clear().type("06/02/2023 06:00 PM", { force: true }); //edit time 
  cy.get("button").contains("Save").click();
  cy.url().should("include", "/schedule"); // check that at the correct url

  //create work event
  cy.get(":nth-child(5) > :nth-child(3)").dblclick();
  cy.get("input[placeholder=Title]").type("Work", { force: true }).should('have.value', 'Work');
  cy.get('input[value="07/02/2023 08:00 AM"]').clear().type("07/02/2023 09:00 AM", { force: true }); //edit time 
  cy.get('input[value="07/02/2023 08:30 AM"]').clear().type("07/02/2023 06:00 PM", { force: true }); //edit time 
  cy.get('input[placeholder="Add description"]').type("D", { force: true });
  cy.get("button").contains("Save").click();
  cy.url().should("include", "/schedule"); // check that at the correct url

  //edit volunteer event title and end time 
  cy.contains("Volunteer").click();
  cy.get("button").get("svg").get('[data-testid^=EditIcon]').click();
  cy.get('input[value="06/02/2023 06:00 PM"]').clear().type("06/02/2023 03:00 PM", { force: true }); //edit time 
  cy.get("input[placeholder=Title]").type("Day", { force: true }).should('have.value', 'VolunteerDay');
  cy.get("button").contains("Save").click();
  cy.url().should("include", "/schedule"); // check that at the correct url
  cy.get("div").contains("VolunteerDay").click(); // check that the event is there
  cy.get(".Content-title").contains("VolunteerDay"); // check that the title is correct
  cy.get("button").get("svg").get('[data-testid^=EditIcon]').click(); //check that start and end time are correct
  cy.get('input[value="06/02/2023 09:00 AM"]');
  cy.get('input[value="06/02/2023 03:00 PM"]');
  });

});
