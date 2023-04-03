/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Unfriend Another User", () => {
    beforeEach(() => {
      cy.viewport(1440, 900);
      cy.visit("/");
    });
  
  it("Delete a user from friend list when logged in (Normal Flow)", () => {
    // main user signs up
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
  
    // complete profile of main user
    cy.visit("/account");
    cy.wait(500);
    const username1 = userEmail1.substring(0, userEmail1.indexOf('@'));
    cy.get('#username').type(username1);
    cy.get('#name').type('name');
    cy.get('#school').type('school');
    cy.get('#bio').type('bio');
    cy.get("button").contains("Submit").click();
  
    // main user logs out
    cy.get("button").contains("Log Out").click();
  
    // potential friend signs up
    const userEmail2 = `e2e+${Math.ceil(
      Math.random() * 1000000000000000
    )}@testdfas.com`;
    cy.get(".w-full > .flex").click();
    cy.origin(
      "https://oncampus.us.auth0.com",
      { args: { userEmail2 } },
      ({ userEmail2 }) => {
        cy.get("a").contains("Sign up").click();
        cy.get("input#email").type(userEmail2);
        cy.get("input#password").type("#e5PUJe9@mrol$", { log: false });
        cy.contains("button[value=default]", "Continue").click();
        cy.get("button").contains("Accept").click();
      }
    );
  
    // complete profile of potential friend
    cy.visit("/account");
    cy.wait(500);
    const username2 = userEmail2.substring(0, userEmail2.indexOf('@'));
    cy.get('#username').type(username2);
    cy.get('#name').type('friendNameA');
    cy.get('#school').type('friendSchoolA');
    cy.get('#bio').type('friendBioA');
    cy.get("button").contains("Submit").click();
    cy.wait(1000);
  
    // sending friend request to main user
    cy.visit("/friendship");
    cy.get('input[type="text"]').type(username1);
    cy.get('ul').find('li:first-child').click();
    cy.wait(500);
    cy.get("button").contains("Request Friend!").click();
    cy.wait(1000);
  
    // potential friend logs out
    cy.get("button").contains("Log Out").click();
    cy.wait(500);
  
    // main user logs in
    cy.get(".w-full > .flex").click();
    cy.origin(
      "https://oncampus.us.auth0.com",
      { args: { userEmail1 } },
      ({ userEmail1 }) => {
        cy.get("input#username").type(userEmail1);
        cy.get("input#password").type("#e5PUJe9@mroL$", { log: false });
        cy.contains("button[value=default]", "Continue").click();
      }
    );
  
    // main user accepts friend request
    cy.visit("/friendrequests");
    cy.wait(2000);
    cy.get("button").contains("Accept").click();
    cy.wait(1000);

    // main user unfriends potential friend
    cy.visit("/friendship");
    cy.get('input[type="text"]').type(username2);
    cy.get('ul').find('li:first-child').click();
    cy.wait(1000);
    cy.get("button").contains("Delete Friend!").click();
    cy.wait(2000);
    cy.url().should("include", "/friendship");
    cy.get("div[data-cy=popup-title").contains("Friendship Deleted!");
    });
  
  it("Delete a user that is not in friend list (Error Flow)", () => {
    // potential friend signs up
    const userEmail2 = `e2e+${Math.ceil(
      Math.random() * 1000000000000000
    )}@testdfas.com`;
    cy.get(".w-full > .flex").click();
    cy.origin(
      "https://oncampus.us.auth0.com",
      { args: { userEmail2 } },
      ({ userEmail2 }) => {
        cy.get("a").contains("Sign up").click();
        cy.get("input#email").type(userEmail2);
        cy.get("input#password").type("#e5PUJe9@mrol$", { log: false });
        cy.contains("button[value=default]", "Continue").click();
        cy.get("button").contains("Accept").click();
      }
    );
  
    // complete profile of potential friend
    cy.visit("/account");
    cy.wait(500);
    const username2 = userEmail2.substring(0, userEmail2.indexOf('@'));
    cy.get('#username').type(username2);
    cy.get('#name').type('friendNameB');
    cy.get('#school').type('friendSchoolB');
    cy.get('#bio').type('friendBioB');
    cy.get("button").contains("Submit").click();
    cy.wait(1000);
  
    // potential friend logs out
    cy.get("button").contains("Log Out").click();

    // main user signs up
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
    
    // complete profile of main user
    cy.visit("/account");
    cy.wait(500);
    const username1 = userEmail1.substring(0, userEmail1.indexOf('@'));
    cy.get('#username').type(username1);
    cy.get('#name').type('name');
    cy.get('#school').type('school');
    cy.get('#bio').type('bio');
    cy.get("button").contains("Submit").click();
    cy.wait(1000);

    // main user unfriends potential friend that is not in friend list
    cy.visit("/friendship");
    cy.get('input[type="text"]').type(username2);
    cy.get('ul').find('li:first-child').click();
    cy.wait(2000);
    cy.get("button").contains("Delete Friend!").click();
    cy.wait(2000);
    cy.url().should("include", "/friendship");
    cy.get("div[data-cy=popup-title").contains("You are not friends!");
    });
  });