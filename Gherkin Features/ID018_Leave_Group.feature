Feature: Leave a group

As an OnCampus User
  I would like to leave a group I am in
  So that I am only in groups that I would like to share a schedule in 

  Background:
    Given the user is logged in the OnCampus system
    And the user is in the group they would like to leave
    And the user is viewing the group page 

  Scenario: Leave a group (Normal Flow)
    When the user requests to leave a group
    Then the user is removed from the group
    And the removed user can no longer access the group's shared schedule 

  Scenario: Leave a group that has been deleted (Error Flow)
    When the user requests to leave a group
    But the group has been deleted by the creator of the group
    Then a "Cannot leave a deleted group" error message is issued
