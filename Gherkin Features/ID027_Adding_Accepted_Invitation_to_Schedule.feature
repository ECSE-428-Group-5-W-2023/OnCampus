Feature: Automatically adding accepted invitations to schedule

As an OnCampus user
I would like to have my newly accepted event invitations to be added onto my schedule
So that I could view and edit my new event


Scenario Outline: User accepted an invitation (Normal Flow)

Given user <email> accepts an invitation to an event <new_event>
When user <email> requests to view their schedule
Then user <email> is able to see that their new event <new_event> is added to their schedule

Scenario Outline: User accepted an invitation and event is deleted (Error Flow)

Given user <email> accepts an invitation to event <deleted_event> that has already been deleted
When user <email> requests to view their schedule
Then user <email> will not see event <deleted_event> on their schedule