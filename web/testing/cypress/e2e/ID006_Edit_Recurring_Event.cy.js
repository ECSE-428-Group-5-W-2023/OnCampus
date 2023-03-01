/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Edit Unique Events", () => {
    beforeEach(() => {
      cy.viewport(1440, 900);
  
      cy.visit("/");
    });
  
  it("Edit a recurring event", () => {
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
  
    //create ECSE428 event
    cy.visit("/schedule");

    cy.wait(5000);
    cy.get(":nth-child(5) > :nth-child(2)").dblclick();
    cy.get("input[placeholder=Title]").type("ECSE428", { force: true }).should('have.value', 'ECSE428');
    cy.get('input[placeholder="Add description"]').type("D", { force: true });
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).clear();
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).should("be.enabled").type("06/02/2023 06:00 PM");
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("06/02/2023 09:00 PM");

    cy.get("label").get("span").contains("Repeat").click();
    cy.get("div").contains("Daily").click();
    cy.get("div").contains("Weekly").click();
    cy.get("button").contains("Mon").click();
    cy.get("label").get("span").get('input[value="endBy"]').click();
    cy.get('div[role="radiogroup"]').within(() => {
    cy.get('input[value="06/02/2023 09:00 PM"]').clear().type("12/04/2023 09:00 PM", { force: true }); //edit time 
    });

    cy.get("button").contains("Save").click();

    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("ECSE428").click(); // check that the event is there
    cy.get(".Content-title").contains("ECSE428"); // check that the title is correct
    cy.visit("/schedule");
    cy.get("button").get("svg").get('[data-testid^=ChevronRightIcon]').click(); //check following week also has event
    cy.get("div").contains("ECSE428").click(); // check that the event is there
    cy.get(".Content-title").contains("ECSE428"); // check that the title is correct

     //create ECSE310 event
     cy.visit("/schedule");
     cy.wait(5000);
     cy.get(":nth-child(5) > :nth-child(2)").dblclick();
     cy.get("input[placeholder=Title]").type("ECSE310", { force: true }).should('have.value', 'ECSE310');
     cy.get('input[placeholder="Add description"]').type("D", { force: true });
     cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).clear();
     cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).should("be.enabled").type("06/02/2023 10:00 AM");
     cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
     cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("06/02/2023 11:30 AM");

     cy.get("label").get("span").contains("Repeat").click();
     cy.get("div").contains("Daily").click();
     cy.get("div").contains("Weekly").click();
     cy.get("button").contains("Mon").click();
     cy.get("button").contains("Wed").click();
     cy.get("label").get("span").get('input[value="endBy"]').click();
     cy.get('div[role="radiogroup"]').within(() => {
     cy.get('input[value="06/02/2023 11:30 AM"]').clear().type("12/04/2023 11:30 AM", { force: true }); //edit time 
     });
 
     cy.get("button").contains("Save").click();
 
     cy.url().should("include", "/schedule"); // check that at the correct url
     cy.get("div").contains("ECSE310").click(); // check that the event is there
     cy.get(".Content-title").contains("ECSE310"); // check that the title is correct
     cy.visit("/schedule");
     cy.get("button").get("svg").get('[data-testid^=ChevronRightIcon]').click(); //check following week also has event
     cy.get("div").contains("ECSE310").click(); // check that the event is there
     cy.get(".Content-title").contains("ECSE310"); // check that the title is correct
  
    //edit the event - ECSE 428 end time  
    cy.visit("/schedule");
    cy.get("div").contains("ECSE428").click(); // check that the event is there
    cy.get("button").get("svg").get('[data-testid^=EditIcon]').click(); //edit event
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("06/02/2023 08:00 PM");
    cy.get("button").contains("Save").click();

    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("ECSE428").click(); // check that the event is there
    cy.get(".Content-title").contains("ECSE428"); // check that the title is correct
    cy.get("button").get("svg").get('[data-testid^=EditIcon]').click(); //check that start and end time are correct
    cy.get('input[value="06/02/2023 06:00 PM"]').should('have.value', '06/02/2023 06:00 PM'); 
    cy.get('input[value="06/02/2023 08:00 PM"]').should('have.value', '06/02/2023 08:00 PM');
    });

    it("Edit a recurring event with invalid dates", () => {
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
    
      //create ECSE428 event
      cy.visit("/schedule");
  
      cy.wait(5000);
      cy.get(":nth-child(5) > :nth-child(2)").dblclick();
      cy.get("input[placeholder=Title]").type("ECSE428", { force: true }).should('have.value', 'ECSE428');
      cy.get('input[placeholder="Add description"]').type("D", { force: true });
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).clear();
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).should("be.enabled").type("06/02/2023 06:00 PM");
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("06/02/2023 09:00 PM");
  
      cy.get("label").get("span").contains("Repeat").click();
      cy.get("div").contains("Daily").click();
      cy.get("div").contains("Weekly").click();
      cy.get("button").contains("Mon").click();
      cy.get("label").get("span").get('input[value="endBy"]').click();
      cy.get('div[role="radiogroup"]').within(() => {
      cy.get('input[value="06/02/2023 09:00 PM"]').clear().type("12/04/2023 09:00 PM", { force: true }); //edit time 
      });
  
      cy.get("button").contains("Save").click();
  
      cy.url().should("include", "/schedule"); // check that at the correct url
      cy.get("div").contains("ECSE428").click(); // check that the event is there
      cy.get(".Content-title").contains("ECSE428"); // check that the title is correct
      cy.visit("/schedule");
      cy.get("button").get("svg").get('[data-testid^=ChevronRightIcon]').click(); //check following week also has event
      cy.get("div").contains("ECSE428").click(); // check that the event is there
      cy.get(".Content-title").contains("ECSE428"); // check that the title is correct
  
       //create ECSE310 event
       cy.visit("/schedule");
       cy.wait(5000);
       cy.get(":nth-child(5) > :nth-child(2)").dblclick();
       cy.get("input[placeholder=Title]").type("ECSE310", { force: true }).should('have.value', 'ECSE310');
       cy.get('input[placeholder="Add description"]').type("D", { force: true });
       cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).clear();
       cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).should("be.enabled").type("06/02/2023 10:00 AM");
       cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
       cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("06/02/2023 11:30 AM");
  
       cy.get("label").get("span").contains("Repeat").click();
       cy.get("div").contains("Daily").click();
       cy.get("div").contains("Weekly").click();
       cy.get("button").contains("Mon").click();
       cy.get("button").contains("Wed").click();
       cy.get("label").get("span").get('input[value="endBy"]').click();
       cy.get('div[role="radiogroup"]').within(() => {
       cy.get('input[value="06/02/2023 11:30 AM"]').clear().type("12/04/2023 11:30 AM", { force: true }); //edit time 
       });
   
       cy.get("button").contains("Save").click();
   
       cy.url().should("include", "/schedule"); // check that at the correct url
       cy.get("div").contains("ECSE310").click(); // check that the event is there
       cy.get(".Content-title").contains("ECSE310"); // check that the title is correct
       cy.visit("/schedule");
       cy.get("button").get("svg").get('[data-testid^=ChevronRightIcon]').click(); //check following week also has event
       cy.get("div").contains("ECSE310").click(); // check that the event is there
       cy.get(".Content-title").contains("ECSE310"); // check that the title is correct
    
      //edit the event - ECSE 428 start and end times
      cy.visit("/schedule");
      cy.get("div").contains("ECSE428").click(); // check that the event is there
      cy.get("button").get("svg").get('[data-testid^=EditIcon]').click(); //edit event
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).clear();
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).should("be.enabled").type("06/02/2023 08:00 PM");
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
      cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("06/02/2023 05:00 PM");
      cy.get("button").contains("Save").click();
      cy.url().should("include", "/schedule"); // check that at the correct url
      cy.get("div[data-cy=popup-title").contains("Start date after end date"); //check that pop up appears 
      });

      
  it("Make a recurring event an unique event", () => {
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
  
    //create Coffee&Chat event
    cy.visit("/schedule");

    cy.wait(5000);
    cy.get(":nth-child(5) > :nth-child(2)").dblclick();
    cy.get("input[placeholder=Title]").type("Coffee&Chat", { force: true }).should('have.value', 'Coffee&Chat');
    cy.get('input[placeholder="Add description"]').type("D", { force: true });
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).clear();
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).should("be.enabled").type("06/02/2023 06:00 PM");
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("06/02/2023 09:00 PM");

    cy.get("label").get("span").contains("Repeat").click();
    cy.get("div").contains("Daily").click();
    cy.get("div").contains("Weekly").click();
    cy.get("button").contains("Mon").click();
    cy.get("label").get("span").get('input[value="endBy"]').click();
    cy.get('div[role="radiogroup"]').within(() => {
    cy.get('input[value="06/02/2023 09:00 PM"]').clear().type("12/04/2023 09:00 PM", { force: true }); //edit time 
    });

    cy.get("button").contains("Save").click();

    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("Coffee&Chat").click(); // check that the event is there
    cy.get(".Content-title").contains("Coffee&Chat"); // check that the title is correct
    cy.visit("/schedule");
    cy.get("button").get("svg").get('[data-testid^=ChevronRightIcon]').click(); //check following week also has event
    cy.get("div").contains("Coffee&Chat").click(); // check that the event is there
    cy.get(".Content-title").contains("Coffee&Chat"); // check that the title is correct

     //create ECSE310 event
     cy.visit("/schedule");
     cy.wait(5000);
     cy.get(":nth-child(5) > :nth-child(2)").dblclick();
     cy.get("input[placeholder=Title]").type("ECSE310", { force: true }).should('have.value', 'ECSE310');
     cy.get('input[placeholder="Add description"]').type("D", { force: true });
     cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).clear();
     cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(0).should("be.enabled").type("06/02/2023 10:00 AM");
     cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
     cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("06/02/2023 11:30 AM");
 
     cy.get("label").get("span").contains("Repeat").click();
     cy.get("div").contains("Daily").click();
     cy.get("div").contains("Weekly").click();
     cy.get("button").contains("Mon").click();
     cy.get("button").contains("Wed").click();
     cy.get("label").get("span").get('input[value="endBy"]').click();
     cy.get('div[role="radiogroup"]').within(() => {
     cy.get('input[value="06/02/2023 11:30 AM"]').clear().type("12/04/2023 11:30 AM", { force: true }); //edit time 
     });
 
     cy.get("button").contains("Save").click();
 
     cy.url().should("include", "/schedule"); // check that at the correct url
     cy.get("div").contains("ECSE310").click(); // check that the event is there
     cy.get(".Content-title").contains("ECSE310"); // check that the title is correct
     cy.visit("/schedule");
     cy.get("button").get("svg").get('[data-testid^=ChevronRightIcon]').click(); //check following week also has event
     cy.get("div").contains("ECSE310").click(); // check that the event is there
     cy.get(".Content-title").contains("ECSE310"); // check that the title is correct
  
    //making Coffee&Chat event an unique event 
    cy.visit("/schedule");
    cy.get("div").contains("Coffee&Chat").click(); // check that the event is there
    cy.get("button").get("svg").get('[data-testid^=EditIcon]').click(); //edit event
    cy.get("label").get("span").contains("Repeat").click();
    cy.get("button").contains("Save").click();

    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("Coffee&Chat").click(); // check that the event is there
    cy.get(".Content-title").contains("Coffee&Chat"); // check that the title is correct
    cy.get("button").get("svg").get('[data-testid^=EditIcon]').click(); //check that start and end time are correct
    cy.get('input[data-indeterminate="false"]'); //check that event is not marked as recurring
    });
  });
  