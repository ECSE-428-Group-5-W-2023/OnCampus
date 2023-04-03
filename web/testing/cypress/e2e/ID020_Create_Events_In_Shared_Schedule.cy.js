/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Create Event in Shared Schedule", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);

    cy.visit("/");
  });

  it("Create Unique Event", () => {
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
    //create a shared schedule
    cy.visit("/friendgroup");
    const groupName = 'my group';
    cy.get("input#groupName").type(groupName);
    cy.get("button").contains("Create").click();
    cy.wait(1000);

    //go to shared schedule
    cy.visit("/schedule");
    cy.get("button").contains(groupName).click();

    cy.get(":nth-child(4) > :nth-child(3)").dblclick();
    cy.wait(1000)//bad practice, but we can't really fix the shedule interface...
    cy.get("input[placeholder=Title]").should("be.enabled").type("Test Unique Event");
    cy.get('input[placeholder="Add description"]').should("be.enabled").type("Test Description");
    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("Test Unique Event").click(); // check that the event is there
    cy.get(".Content-title").contains("Test Unique Event"); // check that the title is correct
  });

  it("Create Recurring Event", () => {
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
    //create a shared schedule
    cy.visit("/friendgroup");
    const groupName = 'my group';
    cy.get("input#groupName").type(groupName);
    cy.get("button").contains("Create").click();
    cy.wait(1000);

    //go to shared schedule
    cy.visit("/schedule");
    cy.get("button").contains(groupName).click();

    cy.get(":nth-child(4) > :nth-child(3)").dblclick();
    cy.wait(1000)//bad practice, but we can't really fix the shedule interface...
    cy.get("input[placeholder=Title]").should("be.enabled").type("Test Recurring Event");
    cy.get('input[placeholder="Add description"]').should("be.enabled").type("Test Description");
    cy.get("label").get("span").contains("Repeat").click();
    cy.get("div").contains("Daily").click();
    cy.get("div").contains("Weekly").click();
    cy.get("button").contains("Tue").click();
    cy.get("button").contains("Thu").click();
    cy.get("label").get("span").get('input[value="endBy"]').click();
    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div").contains("Test Recurring Event").click(); // check that the event is there
    cy.get(".Content-title").contains("Test Recurring Event"); // check that the title is correct
    cy.get("button").get("svg[data-testid^=ChevronRightIcon]").click({force:true}); //check following week also has event
    cy.get("div").contains("Test Recurring Event").click(); // check that the event is there
    cy.get(".Content-title").contains("Test Recurring Event"); // check that the title is correct
  });

  it("Create Unique Event With Wrong Dates", () => {
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
    //create a shared schedule
    cy.visit("/friendgroup");
    const groupName = 'my group';
    cy.get("input#groupName").type(groupName);
    cy.get("button").contains("Create").click();
    cy.wait(1000);

    //go to shared schedule
    cy.visit("/schedule");
    cy.get("button").contains(groupName).click();

    cy.get(":nth-child(4) > :nth-child(3)").dblclick();
    cy.wait(1000)//bad practice, but we can't really fix the shedule interface...
    cy.get("input[placeholder=Title]").should("be.enabled").type("Test Bad Unique Event");
    cy.get('input[placeholder="Add description"]').should("be.enabled").type("Test Description");
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("01/01/0000 12:00 am");
    cy.wait(1000)
    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div[data-cy=popup-title").contains("Start date after end date"); //check error message
  });

  it("Create Recurring Event With Wrong Dates", () => {
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
    //create a shared schedule
    cy.visit("/friendgroup");
    const groupName = 'my group';
    cy.get("input#groupName").type(groupName);
    cy.get("button").contains("Create").click();
    cy.wait(1000);

    //go to shared schedule
    cy.visit("/schedule");
    cy.get("button").contains(groupName).click();

    cy.get(":nth-child(4) > :nth-child(3)").dblclick();
    cy.wait(1000);//bad practice, but we can't really fix the shedule interface...
    cy.get("input[placeholder=Title]").should("be.enabled").type("Test Bad Recurring Event");
    cy.get('input[placeholder="Add description"]').should("be.enabled").type("Test Description");
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).clear();
    cy.get('input[placeholder="dd/mm/yyyy hh:mm (a|p)m"]').eq(1).should("be.enabled").type("01/01/0000 12:00 am");
    cy.wait(1000);
    cy.get("label").get("span").contains("Repeat").click();
    cy.get("div").contains("Daily").click();
    cy.get("div").contains("Weekly").click();
    cy.get("button").contains("Tue").click();
    cy.get("button").contains("Thu").click();
    cy.get("button").contains("Save").click();
    cy.url().should("include", "/schedule"); // check that at the correct url
    cy.get("div[data-cy=popup-title").contains("Start date after end date"); //check error message
  });
});
