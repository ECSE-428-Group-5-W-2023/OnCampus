Feature: Create a shared event

As an OnCampus User
  I would like to create a unique/recurring event on a shared schedule
  So that I can display upcoming events to the shared friend group and keep track of events added by other members


  Scenario: Create a shared unique event with valid inputs in all required fields (Normal Flow)
 
    Given the user is logged in the OnCampus system
    And the user is viewing the shared schedule page
    And the user opens the create schedule window for unique events
    When the user creates an unique event with <event_name>, <start_date>, <end_date> and <is_private>
    Then a new <event_id> is generated
    And the created event is displayed on the shared schedule
    And a “Event <event_name> successfully added to this schedule.” message is issued

    | event_id | event_name | start_date       | end_date         | is_private | is_periodic |end_period | frequency | day_of_week |
    |      001 |    meeting | 02/02/2023 10:30 | 02/02/2023 11:30 |      false |       false |      NULL |      NULL |        NULL |
    |      002 |    meeting | 06/02/2023 11:30 | 06/02/2023 13:30 |      false |       false |      NULL |      NULL |        NULL |


  Scenario: Create a shared recurring event with valid input in all the required fields (Alternative Flow) 

    Given the user is logged in the OnCampus system
    And the user is viewing the shared schedule page
    And the user opens the create schedule window for recurring events
    When the user creates a recurring event with <event_name>, <start_date>, <end_date>, <is_private>, <end_period>, <frequency> and <day_of_week>
    Then a new <event_id> is generated
    And the created event is displayed on the shared schedule
    And a “Event <event_name> successfully added to this schedule.” message is issued

    | event_id | event_name     | start_date     | end_date       | is_private | is_periodic | end_period | frequency | day_of_week |
    |      003 | weekly meeting | 1/4/2023 09:00 | 1/4/2023 10:00 |      false |        true |   3/1/2023 |    weekly |   Wednesday |

  Scenario: Create a new shared unique/recurring event that is overlapping with an existing shared event (Alternative Flow)
    Given the user is logged in the OnCampus system
    And the user is viewing the shared schedule page
    And the user opens the create schedule window
    When the user attempts to create a new event with <event_name>, <start_date>, <end_date>, <is_private>, <end_period>, <frequency>, <day_of_week>
    And the event's <start_date> and <end_date> is overlapping an existing event's <start_date> and <end_date>
    Then a "Warning: Overlapping with EXISTING_EVENT_NAME" pop up window is displayed
    When the user clicks the "Ok" button on the pop up
    Then a new <event_id> is generated
    And the created event is displayed on the schedule
    And a “Event <event_name> successfully added to this schedule.” message is issued

      | event_id | event_name | start_date       | end_date         | is_private | is_periodic | end_period | frequency | day_of_week |
      |      001 |   grooming | 02/02/2023 10:30 | 02/02/2023 13:30 |      false |       false |       NULL |      NULL |        NULL |
      |      002 |    meeting | 02/02/2023 11:45 | 02/02/2023 14:30 |      false |       false |       NULL |      NULL |        NULL |


  Scenario: Attempt to create a shared unique/recurring event with invalid dates (Error Flow) 

    Given the user is logged in the OnCampus system
    And the user is viewing the shared schedule page
    And the user opens the create schedule window
    When the user attempts to create a shared event with <event_name>, <start_date>, <end_date>, <is_private>, <end_period>, <frequency> and <day_of_week>
    And <end_date> is earlier than <start_date>
    Then no new event will be created or displayed
    And a “Invalid date: end date” error message is issued

    Given the user is logged in the OnCampus system
    And the user is viewing the shared schedule page
    And the user opens the create schedule window
    When the user attempts to create a shared event with <event_name>, <start_date>, <end_date>, <is_private>, <end_period>, <frequency> and <day_of_week>
    And <end_period> is earlier than <start_date> or <end_date>
    Then no new event will be created or displayed
    And a “Invalid date: end period” error message is issued

