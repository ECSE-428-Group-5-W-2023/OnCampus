Feature: Remove a user from a group

As an OnCampus User
  I would like to remove a user from a group I am in
  So that groups only contain the users I would like to share my schedule with 

  Background:
    Given the user is logged in the OnCampus system
    And the user is in the group they would like to remove a user from
    And the user is viewing the group page 

  Scenario: Remove a user from a group (Normal Flow)
    When the user requests to remove a user from a group
    And the user to be removed is in the group
    Then the user is removed from the group
    And the removed user can no longer access the group's shared schedule 

  Scenario: Remove a non-existent user from a group (Error Flow)
    When the user requests to remove a user from a group
    And the user to be removed is in the group
    But the user requesting the removal is not the creator of the group
    Then a "Only the creator of the group can remove users from the group" error message is issued
