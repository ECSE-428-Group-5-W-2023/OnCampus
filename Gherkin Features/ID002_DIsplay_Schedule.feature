Feature: Display Schedule 

As an OnCampus User
  I would like to see see my schedule when I log in

  Scenario: User viewing their own schedule
    Given the user is logged in to their account
    When the user clicks on the schedule window
    Then the users schedule will be displayed

  Scenario: User viewing another users schedule
    Given that the user being searched for exists
    When the user searches for another user
    And clicks on their schedule
    Then the searched users schedule will be displayed