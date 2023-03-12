Feature: Viewing a friend's schedule

As an OnCampus User
I would like to view my friend's schedule
So that I can learn when our common free times are

Scenario Outline: Successfully view friend's schedule (Normal Flow)
Given the user opens up their friend's profile
When the user requests to see their friend's schedule
Then the friend's schedule is displayed 

Scenario Outline: Attempt to view friend's schedule but the friend unfriended them (Error Flow)

Given the user opens up their friend's profile
And the friend unfriends them 
When the user requests to see their friend's schedule
Then an "Access Denied" message is issued
And their friend's schedule is not displayed
