/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("View Friend's Schedule", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);

    cy.visit("/");
  });

  it("Successfully view friend's schedule", () => {
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
    cy.wait(5000);
    const username = userEmail1.substring(0, userEmail1.indexOf("@"));
    cy.get("#username").type(username);
    cy.get("#name").type("name");
    cy.get("#school").type("school");
    cy.get("#bio").type("bio");
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
    cy.wait(5000);
    const username2 = userEmail2.substring(0, userEmail2.indexOf("@"));
    cy.get("#username").type(username2);
    cy.get("#name").type("friendName");
    cy.get("#school").type("friendSchool");
    cy.get("#bio").type("friendBio");
    cy.get("button").contains("Submit").click();

    // sending friend request to main user
    cy.visit("/friendship");
    cy.get('input[type="text"]').type(username);
    cy.get("ul").find("li:first-child").click();
    cy.wait(2000);
    cy.get("button").contains("Request Friend!").click();
    cy.wait(5000);

    // potential friend creates a public event on schedule
    cy.visit("/schedule");
    cy.get(":nth-child(4) > :nth-child(3)").dblclick();
    cy.wait(5000); //bad practice, but we can't really fix the shedule interface...
    cy.get("input[placeholder=Title]").should("be.enabled").type("Test Event");
    cy.get('input[placeholder="Add description"]')
      .should("be.enabled")
      .type("Test Description");
    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.wait(5000);

    // potential friend logs out
    cy.get("button").contains("Log Out").click();

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

    // main user checks friend request
    cy.visit("/friendrequests");
    cy.wait(5000);
    // accept friend request
    cy.get("button").contains("Accept").click();
    cy.wait(5000);

    // main user attempts to view their friend's schedule
    cy.visit("/friendship");
    cy.get('input[type="text"]').type(username2);
    cy.get("ul").find("li:first-child").click();
    cy.wait(2000);
    cy.get("button").contains("View Friend's Schedule").click();
    cy.wait(5000);

    // check that the friend's schedule is there
    cy.url().should("include", "/friendSchedule"); // check that at the correct url
    cy.get("div").contains("Test Event").click(); // check that the event is there
    cy.get(".Content-title").contains("Test Event"); // check that the title is correct

  });

  it("Failed to view person's schedule because they are not friends", () => {
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
    cy.wait(5000);
    const username = userEmail1.substring(0, userEmail1.indexOf("@"));
    cy.get("#username").type(username);
    cy.get("#name").type("name");
    cy.get("#school").type("school");
    cy.get("#bio").type("bio");
    cy.get("button").contains("Submit").click();

    // main user logs out
    cy.get("button").contains("Log Out").click();

    // non-friend signs up
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

    // complete profile of non-friend
    cy.visit("/account");
    cy.wait(5000);
    const username2 = userEmail2.substring(0, userEmail2.indexOf("@"));
    cy.get("#username").type(username2);
    cy.get("#name").type("friendName");
    cy.get("#school").type("friendSchool");
    cy.get("#bio").type("friendBio");
    cy.get("button").contains("Submit").click();

    // non-friend creates a public event on schedule
    cy.visit("/schedule");
    cy.get(":nth-child(4) > :nth-child(3)").dblclick();
    cy.wait(1000); //bad practice, but we can't really fix the shedule interface...
    cy.get("input[placeholder=Title]").should("be.enabled").type("Test Event");
    cy.get('input[placeholder="Add description"]')
      .should("be.enabled")
      .type("Test Description");
    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.wait(1000);

    // non-friend logs out
    cy.get("button").contains("Log Out").click();

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

    // main user attempts to view the person's schedule
    cy.visit("/friendship");
    cy.get('input[type="text"]').type(username2);
    cy.get("ul").find("li:first-child").click();
    cy.wait(2000);
    cy.get("button").contains("View Friend's Schedule").click();
    cy.wait(5000);

    // check that the friend's schedule is there
    cy.url().should("include", "/friendSchedule"); // check that at the correct url
    cy.get("div").contains("You are not friends!"); // check that error message popup appears
  });
});
