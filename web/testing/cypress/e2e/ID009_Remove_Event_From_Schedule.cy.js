/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Remove Event From Schedule", () => {
    beforeEach(() => {
      cy.viewport(1440, 900);
  
      cy.visit("/");
    });

    it("Remove Event from Schedule", () => {
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
          cy.get("input#email").type(userEmail); //me might have to go through signup every time and create a new account? might trigger the auth0 limits if we do that...
          cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
          cy.contains("button[value=default]", "Continue").click();
          cy.get("button").contains("Accept").click();
        }
    );

    //create volunteer event
    cy.visit("/schedule");
    cy.wait(5000);
    cy.get(":nth-child(5) > :nth-child(2)").dblclick();
    cy.get("input[placeholder=Title]").type("Volunteer", { force: true }).should('have.value', 'Volunteer');
    cy.get('input[placeholder="Add description"]').type("D", { force: true });
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).clear();
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).should("be.enabled").type("06/02/2023 09:00 AM");
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("06/02/2023 06:00 PM");
    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("Volunteer").click(); // check that the event is there
    cy.get(".Content-title").contains("Volunteer"); // check that the title is correct
  
    //delete volunteer event
    cy.visit("/schedule");
    cy.wait(5000);
    cy.contains("Volunteer").click();
    cy.get("button").get("svg").get('[data-testid^=DeleteIcon]').click();
    cy.get("button").contains("Delete").click();

    //check that the volunteer event is deleted
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("Volunteer").should("not.exist");
    });

    it("Unauthorized Delete Attempt due to login", () => {
        //not logged in
        //create volunteer event
        Cypress.on('uncaught:exception', (err, runnable) => { //this is to ignore the error that happens when you try to access schedule without logging in
            return false;
        });
        cy.visit("/schedule");
        cy.wait(5000);
        cy.get(":nth-child(5) > :nth-child(2)").dblclick();
        cy.get("input[placeholder=Title]").type("Volunteer", { force: true }).should('have.value', 'Volunteer');
        cy.get('input[placeholder="Add description"]').type("D", { force: true });
        cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).clear();
        cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).should("be.enabled").type("06/02/2023 09:00 AM");
        cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
        cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("06/02/2023 06:00 PM");
        cy.get("button").contains("Save").click();
        cy.url().should("include", "/schedule"); // check that at the correct url

        //can't delete event without the event existing (without login)
        cy.get("div").contains("Volunteer").should("not.exist");
    });

    it("Delete Non-Existent Event", () => {
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
              cy.get("input#email").type(userEmail); //me might have to go through signup every time and create a new account? might trigger the auth0 limits if we do that...
              cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
              cy.contains("button[value=default]", "Continue").click();
              cy.get("button").contains("Accept").click();
            }
        );

        //create volunteer event but do not save it
        cy.visit("/schedule");
        cy.wait(5000);
        cy.get(":nth-child(5) > :nth-child(2)").dblclick();
        cy.get("input[placeholder=Title]").type("Volunteer", { force: true }).should('have.value', 'Volunteer');
        cy.get('input[placeholder="Add description"]').type("D", { force: true });
        cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).clear();
        cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).should("be.enabled").type("06/02/2023 09:00 AM");
        cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
        cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("06/02/2023 06:00 PM");
        cy.get("button").get("svg").get('[data-testid^=CloseIcon]').click(); //close the window without saving
        cy.get("button").contains("Discard").click();

        //can't delete event without the event existing in the database
        cy.get("div").contains("Volunteer").should("not.exist");
    });
    
  });
  