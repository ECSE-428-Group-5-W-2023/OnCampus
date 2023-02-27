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
    cy.get(":nth-child(5) > :nth-child(2)").dblclick();
    cy.get("input[placeholder=Title]").type("ECSE428", { force: true }).should('have.value', 'ECSE428');
    cy.get('input[placeholder="Add description"]').type("D", { force: true });
    cy.get('input[value="06/02/2023 08:00 AM"]').click().clear().type("05/02/2023 06:00 PM", {delay: 100}, { force: true }); //edit time 
    cy.get('input[value="06/02/2023 08:30 AM"]').clear().type("05/02/2023 09:00 PM", { force: true }); //edit time 

    cy.get("label").get("span").contains("Repeat").click();
    cy.get("div").contains("Daily").click();
    cy.get("div").contains("Weekly").click();
    cy.get("MuiButtonBase-root MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButton-fullWidth MuiButtonGroup-grouped MuiButtonGroup-groupedHorizontal MuiButtonGroup-groupedOutlined MuiButtonGroup-groupedOutlinedHorizontal MuiButtonGroup-groupedOutlinedPrimary MuiButton-root MuiButton-outlined MuiButton-outlinedPrimary MuiButton-sizeSmall MuiButton-outlinedSizeSmall MuiButton-fullWidth WeeklyRecurrenceSelector-button css-ud2js3-MuiButtonBase-root-MuiButton-root").contains("MON").click();
    //cy.get('div[role="group"]').get("button").contains("MON").click();
   // cy.get(div).contains("WED").click();

    cy.get("label").get("span").get('input[value="endBy"]').click();
    cy.get('input[aria-label="Choose date, selected date is Feb 5, 2023"]').clear().type("13/04/2023 09:00 PM", {delay: 100}, { force: true });


    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
  
    //edit the event TODO 

    });
  });
  