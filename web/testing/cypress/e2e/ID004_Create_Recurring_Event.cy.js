/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Create Recurring Events", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);

    cy.visit("/");
  });

  it("Create a recurring event", () => {
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

    //create COMP251 event
    cy.visit("/schedule");

    cy.wait(5000);
    cy.get(":nth-child(5) > :nth-child(2)").dblclick();
    cy.get("input[placeholder=Title]").type("COMP251", { force: true }).should("have.value", "COMP251");
    cy.get('input[placeholder="Add description"]').type("Algorithms :D", { force: true });
    cy.get('input[value="06/02/2023 08:00 AM"]').click().clear().type("06/02/2023 02:30 PM", { delay: 100 }, { force: true }); //edit time
    cy.get('input[value="06/02/2023 08:30 AM"]').clear().type("06/02/2023 04:00 PM", { force: true }); //edit time
    cy.get("label").get("span").contains("Repeat").click();
    cy.get("div").contains("Daily").click();
    cy.get("div").contains("Weekly").click();
    cy.get("button").contains("Tue").click();
    cy.get("button").contains("Thu").click();
    cy.get("label").get("span").get('input[value="endBy"]').click();
    cy.get('div[role="radiogroup"]').within(() => {
    cy.get('input[value="06/02/2023 04:00 PM"]').clear().type("12/04/2023 04:00 PM", { force: true }); //edit time
    });

    cy.get("button").contains("Save").click();

    //Assert correct creation of COMP251 Event
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("COMP251").click(); // check that the event is there
    cy.get(".Content-title").contains("COMP251"); // check that the title is correct
    cy.visit("/schedule");
    cy.get("button")
      .get("svg")
      .get("[data-testid^=ChevronRightIcon]")
      .click(); //check following week also has event
    cy.get("div").contains("COMP251").click(); // check that the event is there
    cy.get(".Content-title").contains("COMP251"); // check that the title is correct
  });
});
