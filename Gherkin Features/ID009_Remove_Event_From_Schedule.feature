Feature: Remove an event from schedule

As a OnCampus User
I would like to delete my existing unique / recurring event
So that I can keep my schedule up-to-date

Scenario: Delete Event from Schedule

Given the user with email "nikolas.pasichnik@mail.mcgill.ca" and password "np001" is signed in
And the event "ECSE 428" exists in the user's schedule
When the user deletes the event "ECSE 428" from their schedule
Then the event "ECSE 428" should no longer be in the user's schedule


Scenario: Unauthorized Delete Attempt due to login

Given the user is not signed in to their account
When the user attempts to delete an event
Then the user should be prompted to sign in to their account
And the delete action should not be performed until the user is signed in.


Scenario: Delete Non-Existent Event
 
Given the user with email "nikolas.pasichnik@mail.mcgill.ca" and password "np001" is signed in
And the event "ECSE 428" exists
And the event "ECSE 428" does not exist in the user's schedule
When the user deletes the event "ECSE 428" from their schedule
Then the user should be prompted with an error
