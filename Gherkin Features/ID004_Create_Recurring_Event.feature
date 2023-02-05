Feature: Create a recurring event

As an user
  I would like to create a recurring event
  So I can add a new recurring event on the schedule

Scenario: User creates a recurring event with valid input in all the required fields (Normal Flow) 

  Given the user is logged into the onCampus Software System
  And the user opens the create schedule window
  And the user toggles “Recurring event”
  When the user creates the recurring event with <name>, <start_date>, <end_date>, <is_private>, <end_period> and <frequency>
  Then the new event is created and displayed on the schedule
  And a “Event <event_name> successfully added to your schedule.” message is issued

  | event_id | event_name | start_date | end_date | is_periodic | is_private | end_period | frequency | day_of_week |
  | 001 | ECSE428 | 1/4/2023 09:00 | 1/4/2023 10:00 | true | true | 3/1/2023 | weekly | Wednesday |

Scenario: User creates a recurring event that overlaps one or more existing events (Normal Flow) 

  Given the user is logged into the onCampus Software System
  And the user opens the create schedule window
  And the user toggles “Recurring event”
  When the user creates the recurring event with <name>, <start_date>, <end_date>, <is_private>, <end_period> and <frequency>
  And the event's <start_date> and <end_date> is overlapping an existing event's <start_date> and <end_date>
  Then a "Warning: Overlapping with EXISTING_EVENT_NAME" pop up window is displayed
  When the user clicks the "Ok" button on the pop up
  Then the new event is created and displayed on the schedule
  And a “Event <event_name> successfully added to your schedule.” message is issued

Scenario: Attempt to create a recurring event with invalid dates (Error Flow) 

  Given the user is logged into the onCampus Software System
  And the user opens the create schedule window
  And the user toggles “Recurring event”
  When the user enters <name>, <start_date>, <end_date>, <is_private>, <end_period> and <frequency> and attempts to create
  And <end_date> is earlier than <start_date>
  Then no new event will be created or displayed
  And a “Invalid date: end date” error message is issued

  Given the user is logged into the onCampus Software System
  And the user opens the create schedule window
  And the user toggles “Recurring event”
  When the user enters <name>, <start_date>, <end_date>, <is_private>, <end_period> and <frequency> and attempts to create
  And <end_period> is earlier than <start_date> or <end_date>
  Then no new event will be created or displayed
  And a “Invalid date: end period” error message is issued
