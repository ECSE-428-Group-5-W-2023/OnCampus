Feature: Edit an unique event

As an user
    I would like to edit an unique event
    So that details of my event can be modified

Scenario Outline: User edits an attribute of an existing unique event (Normal Flow)

    Given the following events displayed on the schedule:

    | event_id | event_name | start_date | end_date | is_recurring | end_period | frequency | day_of_week |
    | 001 | Volunteer | 6/2/2023 09:00 | 6/2/2023 18:00 | false | null | null | null |
    | 002 | Work | 7/2/2023 09:00 | 7/2/2023 18:00 | false | null | null | null |

    When the user selects <event_id>
    And the user modifies the <end_date>
    And the user clicks on the "Save" button
    Then the updated event is saved
    And the following events are displayed on the schedule

    | event_id | event_name | start_date | end_date | is_recurring | end_period | frequency | day_of_week |
    | 001 | Volunteer | 6/2/2023 09:00 | 6/2/2023 15:00 | false | null | null | null |
    | 002 | Work | 7/2/2023 09:00 | 7/2/2023 18:00 | false | null | null | null |

Scenario Outline: User edits an existing unique event with invalid dates (Error Flow)

    Given the following events displayed on the schedule:

    | event_id | event_name | start_date | end_date | is_recurring | end_period | frequency | day_of_week |
    | 001 | Volunteer | 6/2/2023 09:00 | 6/2/2023 18:00 | false | null | null | null |
    | 002 | Work | 7/2/2023 09:00 | 7/2/2023 18:00 | false | null | null | null |

    When the user selects <event_id>
    And the user modifies <end_date> to earlier than <start_date> 
    And the user clicks on the "Save" button
    Then an “Invalid edit request” message is issued
    And the updated event is not saved

Scenario Outline: User modifies an unique event to a recurring event (Normal Flow)

    Given the following events displayed on the schedule:

    | event_id | event_name | start_date | end_date | is_recurring | end_period | frequency | day_of_week |
    | 001 | Volunteer | 6/2/2023 09:00 | 6/2/2023 18:00 | false | null | null | null |
    | 002 | Work | 7/2/2023 09:00 | 7/2/2023 18:00 | false | null | null | null |

    When the user selects <event_id>
    And the user modifies <is_recurring> of the event to true
    And the user fills in <end_period>, <frequency>, <day_of_week>
    And the user clicks on the "Save" button
    Then the updated event is saved
    And the following events are displayed on the schedule

    | event_id | event_name | start_date | end_date | is_recurring | end_period | frequency | day_of_week |
    | 001 | Volunteer | 6/2/2023 09:00 | 6/2/2023 18:00 | false | null | null | null |
    | 002 | Work | 7/2/2023 09:00 | 7/2/2023 18:00 | true | 12/4/2023 | weekly | [Monday] |

Scenario Outline: User modifies an unique event to a recurring event with an invalid date (Error Flow)

    Given the following events displayed on the schedule:

    | event_id | event_name | start_date | end_date | is_recurring | end_period | frequency | day_of_week |
    | 001 | Volunteer | 6/2/2023 09:00 | 6/2/2023 18:00 | false | null | null | null |
    | 002 | Work | 7/2/2023 09:00 | 7/2/2023 09:00 | false | null | null | null |

    When the user selects <event_id>
    And the user modifies <is_recurring> of the event to true
    And the user fills in <frequency>, <day_of_week>
    And the user fills in <end_period> to earlier than <start_date> or <end_date>
    And the user clicks on the "Save" button
    Then an “Invalid edit request” message is issued
    And the updated event is not saved
 