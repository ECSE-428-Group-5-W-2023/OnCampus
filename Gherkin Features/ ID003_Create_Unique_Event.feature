Feature: Create a unique event

As an OnCampus User
  I would like to create a unique event on my schedule
  So that I can keep track of upcoming events that do not repeat more than once

  Background:
    Given the user is logged in the OnCampus system
    And the user is viewing their schedule page

  Scenario Outline: Create a new unique event (Normal Flow)
    When the user requests adding a new unique event for their schedule with <event_name>, <start_date>, <end_date>, <is_periodic>, <end_period>, <frequency>, <day_of_week> to the OnCampus system
    Then a new <event_id> is generated
    Then the newly created event is displayed on the schedule

    Examples:
    | event_id | event_name | start_date       | end_date         | is_periodic | end_period | frequency | day_of_week |
    |      001 |   Workshop | 02/02/2023 10:30 | 02/02/2023 11:30 |       false |       NULL |      NULL |        NULL |
    |      002 |     Brunch | 06/02/2023 11:30 | 06/02/2023 13:30 |       false |       NULL |      NULL |        NULL |

  Scenario Outline: Create a new unique event that is overlapping with an existing event (Normal Flow)
    When the user requests adding a new unique event for their schedule with <event_name>, <start_date>, <end_date>, <is_periodic>, <end_period>, <frequency>, <day_of_week> to the OnCampus system
    And the requested event <start_date> and <end_date> is overlapping an existing event's <start_date> and <end_date>
    Then a "Warning: Overlapping Events" pop up message is issued
    And the user clicks the "Ok" button on the pop up
    Then a new <event_id> is generated
    Then the newly created event is displayed on the schedule

    Examples:
      | event_id |     event_name    | start_date       | end_date         | is_periodic | end_period | frequency | day_of_week |
      |      001 |   Watch the cat   | 04/02/2023 10:30 | 02/02/2023 13:30 |       false |       NULL |      NULL |        NULL |
      |      002 |   Work on project | 04/02/2023 11:45 | 06/02/2023 14:30 |       false |       NULL |      NULL |        NULL |


  Scenario: Create a new unique event with the wrong order of dates (Error Flow)
    When the user requests adding a new unique event for their schedule with <event_name>, <start_date>, <end_date>, <is_periodic>, <end_period>, <frequency>, <day_of_week> to the OnCampus system
    And the event end date <end_date> is earlier than its start date <start_date>
    Then an "Invalid dates" message is issued

