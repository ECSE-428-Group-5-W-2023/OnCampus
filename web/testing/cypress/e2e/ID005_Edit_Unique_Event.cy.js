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
  cy.wait(1000);
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

  //create work event
  cy.visit("/schedule");
  cy.wait(5000);
  cy.get(":nth-child(5) > :nth-child(3)").dblclick();
  cy.get("input[placeholder=Title]").type("Work", { force: true }).should('have.value', 'Work');
  cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).clear();
  cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).should("be.enabled").type("07/02/2023 09:00 AM");
  cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
  cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("07/02/2023 06:00 PM");
  cy.get('input[placeholder="Add description"]').type("D", { force: true });
  cy.get("button").contains("Save").click();
  cy.url().should("include", "/schedule"); // check that at the correct url
  cy.get("div").contains("Work").click(); // check that the event is there
  cy.get(".Content-title").contains("Work"); // check that the title is correct

  //edit volunteer event title and end time 
  cy.visit("/schedule");
  cy.wait(5000);
  cy.contains("Volunteer").click();
  cy.get("button").get("svg").get('[data-testid^=EditIcon]').click();
  cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
  cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("06/02/2023 03:00 PM");
  cy.get("input[placeholder=Title]").type("Day", { force: true }).should('have.value', 'VolunteerDay');
  cy.get("button").contains("Save").click();
  cy.url().should("include", "/schedule"); // check that at the correct url
  cy.get("div").contains("VolunteerDay").click(); // check that the event is there
  cy.get(".Content-title").contains("VolunteerDay"); // check that the title is correct
  cy.get("button").get("svg").get('[data-testid^=EditIcon]').click(); //check that start and end time are correct
  cy.get('input[value="06/02/2023 09:00 AM"]'); // might need to change this if we set up /schedule to go to current date 
  cy.get('input[value="06/02/2023 03:00 PM"]');
  });

  it("Make an unique event to a recurring event", () => {
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
  
    //create work event
    cy.visit("/schedule");
    cy.wait(5000);
    cy.get(":nth-child(5) > :nth-child(3)").dblclick();
    cy.get("input[placeholder=Title]").type("Work", { force: true }).should('have.value', 'Work');
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).clear();
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).should("be.enabled").type("07/02/2023 09:00 AM");
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("07/02/2023 06:00 PM");
    cy.get('input[placeholder="Add description"]').type("D", { force: true });
    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("Work").click(); // check that the event is there
    cy.get(".Content-title").contains("Work"); // check that the title is correct
  
    //making work event into a recurring event 
    cy.visit("/schedule");
    cy.wait(5000);
    cy.contains("Work").click();
    cy.get("button").get("svg").get('[data-testid^=EditIcon]').click();
    cy.get("label").get("span").contains("Repeat").click();
    cy.get("div").contains("Daily").click();
    cy.get("div").contains("Weekly").click();
    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("Work").click(); // check that the event is there
    cy.get(".Content-title").contains("Work"); // check that the title is correct
    cy.get("button").get("svg").get('[data-testid^=EditIcon]').click(); 

    //check following week also has work event 
    cy.visit("/schedule");
    cy.get("button").get("svg").get('[data-testid^=ChevronRightIcon]').click();
    cy.get("div").contains("Work").click(); // check that the event is there
    cy.get(".Content-title").contains("Work"); // check that the title is correct
    });

    it("Edit an unique event with invalid dates", () => {
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
      cy.wait(1000);
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
    
      //create work event
      cy.visit("/schedule");
      cy.wait(5000);
      cy.get(":nth-child(5) > :nth-child(3)").dblclick();
      cy.get("input[placeholder=Title]").type("Work", { force: true }).should('have.value', 'Work');
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).clear();
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).should("be.enabled").type("07/02/2023 09:00 AM");
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("07/02/2023 06:00 PM");
      cy.get('input[placeholder="Add description"]').type("D", { force: true });
      cy.get("button").contains("Save").click();
      cy.url().should("include", "/schedule"); // check that at the correct url
      cy.get("div").contains("Work").click(); // check that the event is there
      cy.get(".Content-title").contains("Work"); // check that the title is correct
    
      //edit volunteer event title and end time 
      cy.visit("/schedule");
      cy.wait(5000);
      cy.contains("Volunteer").click();
      cy.get("button").get("svg").get('[data-testid^=EditIcon]').click();
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("05/02/2023 09:00 PM");
      cy.get("button").contains("Save").click();
      cy.url().should("include", "/schedule"); // check that at the correct url
      cy.get("div[data-cy=popup-title").contains("Start date after end date"); //check that pop up appears 
      });

});
