/* eslint-disable no-undef */
/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe("Basic app navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("navigates to the home page", () => {
    cy.get('.mx-2 > .hidden').click();
    cy.url().should("include", "/");
  });
});
