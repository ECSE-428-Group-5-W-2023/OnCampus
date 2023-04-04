Feature: Create a group of friends 

As an OnCampus User
  I would like to create a group of friends 
  So that I could share a single schedule where we can see our shared events

  Background:
    Given the user is logged in the OnCampus system
    And the user is viewing their friend groups page
    And the user has email as <email>

  Scenario Outline: Create a new group of friends event (Normal Flow)
    When the user requests to create a new group of friends
    Then a new <group_id> is generated with <email> as a member
    Then a new friend group is created with <group_id> and <email>

  Scenario Outline: Create a new group of friends while not being logged in (Error Flow)
    When the user requests to create a new group of friends without being logged in 
    Then a new friend group is not successfully created

