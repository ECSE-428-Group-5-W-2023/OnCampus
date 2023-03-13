Feature: Add event from course code

    As an Oncampus User
    I would like to add an event from a course code
    So that my schedule reflects my current courseload

    Scenario Outline: Add event from course code (Normal Flow)
        Given user <email> is logged in
        When user <email> adds event from course code <course>
        Then user <email> sees event with the information matching <course> in his schedule

            | email                         | course   |
            | archie.andrews@mail.mcgill.ca | ECSE_210 |
            | betty.cooper@mail.mcgill.ca   | COMP_206 |
            | jughead.jones@mail.mcgill.ca  | GEOG_203 |

    Scenario Outline: User adds event with an incorrect course code (Error Flow)

        Given user <email> is logged in
        When user <email> adds event from course code <course>
        Then an "Invalid course code" message is issued

            | email                         | course   |
            | archie.andrews@mail.mcgill.ca | ESCE_210 |
            | betty.cooper@mail.mcgill.ca   | COMM_2!6 |
            | jughead.jones@mail.mcgill.ca  | EOG_203  |

    Scenario Outline: User adds event with a course code that conflicts with an existing event (Alternate Flow)

        Given user <email> is logged in
        Given user <email> has an event conficting with <course>
        When user <email> adds event from course code <course>
        Then an "Event conflicts with existing event" message is issued
        And user <email> is given the option to replace the existing event, or cancel the addition, or add the event

            | email                         | course   |
            | archie.andrews@mail.mcgill.ca | ECSE_210 |
            | betty.cooper@mail.mcgill.ca   | COMP_206 |
            | jughead.jones@mail.mcgill.ca  | GEOG_203 |