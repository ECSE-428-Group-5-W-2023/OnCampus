/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Create a group", () => {
    beforeEach(() => {
      cy.viewport(1440, 900);
      cy.visit("/");
    });

    it("Successfully create a group", () => {
        // log in 
        const userEmail1 = `e2e+${Math.ceil(
          Math.random() * 1000000000000000
        )}@testdfas.com`;
        cy.get(".w-full > .flex").click();
        cy.origin(
          "https://oncampus.us.auth0.com",
          { args: { userEmail1 } },
          ({ userEmail1 }) => {
            cy.get("a").contains("Sign up").click();
            cy.get("input#email").type(userEmail1); 
            cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
            cy.contains("button[value=default]", "Continue").click();
            cy.get("button").contains("Accept").click();
          }
        );
      
        // complete profile 
        cy.visit("/account");
        cy.wait(4000);
        cy.get('#username').type('testUser');
        cy.get('#name').type('testName');
        cy.get('#school').type('testSchool');
        cy.get('#bio').type('testBio');
        cy.get("button").contains("Submit").click();
      
        // Create a group
        cy.visit("/friendgroup");
        cy.wait(2000);
        cy.get("#groupName").type('ECSE');
        cy.get('#groupDescription').type('ECSE group');
        cy.get("button").contains("Create").click();

        //Check if group is created
        cy.wait(2000);
        cy.get("button").contains("Leave Group");
        });

    it("Unsuccessfully create group due to not being logged in", () => {
        
        // Create a group
        cy.visit("/friendgroup");
        cy.wait(2000);
        cy.get("#groupName").type('ECSE');
        cy.get('#groupDescription').type('ECSE group');
        cy.get("button").contains("Create").click();
        
        //ignores the error that is thrown when the user is not logged in
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false;
          });

        //Check that there are no groups created
        cy.wait(2000);
        cy.get("button").contains("Leave Group").should('not.exist');
        });
      });
