Feature: Viewing a friend's schedule

As an OnCampus User
I would like to view my friend's schedule
So that I can learn when our common free times are

Scenario Outline: Successfully view friend's schedule (Normal Flow)
Given the user opens up their friend's profile
When the user requests to see their friend's schedule
Then the friend's schedule is displayed 

Scenario Outline: Attempt to view a person's schedule but the they are not friends (Error Flow)

Given the user opens up the person's profile
And the user is not friends with the person
When the user requests to see the person's schedule
Then an "Access Denied" message is issued
And their person's schedule is not displayed
