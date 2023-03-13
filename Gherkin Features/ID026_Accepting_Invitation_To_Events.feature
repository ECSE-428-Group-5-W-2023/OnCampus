Feature: Accept invitation to an event

As a OnCampus User
I would like to delete my existing unique / recurring event
So that I can keep my schedule up-to-date

Background:
Given a user is signed in

Scenario: Accept invitation to a recurring event
Given that the user has received an invitation to a recurring event
And there are no conflicting events
When the user attempts to accept the invitation
Then all instances of the recurring event should be added to the users schedule

Scenario: Accept invitation to a unique event
Given that the user has received an invitation to a unique event
And there is no conflicting event
When the user attempts to accept the invitation
Then the unique event should be added to the users schedule

Scenario: Accept invitation with conflicting event
Given that the user has received an invitation to an event
And there is a conflict with one of the users events
When the user attempts to accept the invitation
Then the unique event should not be added to the users schedule
And the user should be notified of the conflict