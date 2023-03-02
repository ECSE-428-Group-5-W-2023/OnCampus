Feature: Edit a recurring event

As an OnCampus User
    I would like to edit a recurring event
    So that details of my event can be modified

    Background:
    Given the user is logged in the OnCampus system
    And the user is viewing their schedule page

Scenario Outline: User edits an attribute of an existing recurring event (Normal Flow)

    Given the following events displayed on the schedule:

    | event_id | event_name | start_date | end_date | is_recurring | end_period | frequency | day_of_week |
    | 001 | ECSE428 | 6/2/2023 18:00 | 6/2/2023 21:00 | true | 12/4/2023 | weekly | [Monday] |
    | 002 | ECSE310 | 6/2/2023 10:00 | 6/2/2023 11:30 | true | 12/4/2023 | weekly | [Monday, Wednesday] |

    When the user selects <event_id>
    And the user modifies the <end_date>
    And the user clicks on the "Save" button
    Then the updated event is saved
    And the following events are displayed on the schedule

    | event_id | event_name | start_date | end_date | is_recurring | end_period | frequency | day_of_week |
    | 001 | ECSE428 | 6/2/2023 18:00 | 6/2/2023 20:00 | true | 12/4/2023 | weekly | [Monday] |
    | 002 | ECSE310 | 6/2/2023 10:00 | 6/2/2023 11:30 | true | 12/4/2023 | weekly | [Monday, Wednesday] |

Scenario Outline: User edits an existing recurring event with invalid dates (Error Flow)

    Given the following events displayed on the schedule:

    | event_id | event_name | start_date | end_date | is_recurring | end_period | frequency | day_of_week |
    | 001 | ECSE428 | 6/2/2023 18:00 | 6/2/2023 21:00 | true | 12/4/2023 | weekly | [Monday] |
    | 002 | ECSE310 | 6/2/2023 10:00 | 6/2/2023 11:30 | true | 12/4/2023 | weekly | [Monday, Wednesday] |

    When the user selects <event_id>
    And the user modifies <end_date> to earlier than <start_date> 
    And the user clicks on the "Save" button
    Then an “Invalid edit request” message is issued
    And the updated event is not saved

Scenario Outline: User modifies an existing recurring event to an unique event (Normal Flow)

    Given the following events displayed on the schedule:

    | event_id | event_name | start_date | end_date | is_recurring | end_period | frequency | day_of_week |
    | 001 | Coffee&Chat | 6/2/2023 18:00 | 6/2/2023 21:00 | true | 12/4/2023 | weekly | [Monday] |
    | 002 | ECSE310 | 6/2/2023 10:00 | 6/2/2023 11:30 | true | 12/4/2023 | weekly | [Monday, Wednesday] |

    When the user selects <event_id>
    And the user modifies <is_recurring> of the event to false
    And the user clicks on the "Save" button
    Then the updated event is saved
    And the following events are displayed on the schedule

    | event_id | event_name | start_date | end_date | is_recurring | end_period | frequency | day_of_week |
    | 001 | Coffee&Chat | 6/2/2023 18:00 | 6/2/2023 21:00 | false | null | null | null |
    | 002 | ECSE310 | 6/2/2023 10:00 | 6/2/2023 11:30 | true | 12/4/2023 | weekly | [Monday, Wednesday] |
 