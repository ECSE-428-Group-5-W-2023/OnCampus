Feature: Connection Between Users

As an OnCampus User
I would like to find other users
So that I can connect with other users

Scenario Outline: Search Friend With Correct Username (Normal Flow)
Given the user opens the search friend page
When the user attempts to search for a username that has an OnCampus account
Then an "Account Found" message is issued
And the account is displayed

| username | email | name | school | bio |
| JD | john.doe@mail.mcgill.ca | John Doe | McGill University | looking for jane doe |

Scenario Outline: Search Friend With Incorrect Username (Error Flow)

Given the user opens the search friend page
When the user attempts to search for a user with an incorrect username
Then an "Account Not Found" message is issued
And no account is displayed
