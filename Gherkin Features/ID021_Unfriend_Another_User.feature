Feature: Unfriend Another User

As an OnCampus User
I would like to remove another user from my friend list
So that I can stop sharing my schedule to them

Background:
Given the user with email "jake.doe@mail.mcgill.ca" and password "jk123" is logged into their account in OnCampus
And the user has friend list:

| username | email | name | school | bio |
| JoD | john.doe@mail.mcgill.ca | John Doe | McGill University | looking for jane doe |
| JoD | jane.doe@mail.mcgill.ca | Jane Doe | McGill University | looking for john doe | 

Scenario Outline: Delete a user from friend list when logged in (Normal Flow)

When the user requests to delete "John Doe" with email "john.doe@mail.mcgill.ca" from their friend list
Then the user "John Doe" is no longer in the user's friend list
And the user's friend list is updated to:

| username | email | name | school | bio |
| JoD | jane.doe@mail.mcgill.ca | Jane Doe | McGill University | looking for john doe | 

Scenario Outline: Delete a user from friend list when logged out (Error Flow)

Given the user with email "jake.doe@mail.mcgill.ca" and password "jk123" is logged out of their account in OnCampus
When the user requests to remove "John Doe" with email "john.doe@mail.mcgill.ca" from their friend list
Then the user is prompted to log into their account
And the user's friend list is unchanged

Scenario Outline: Delete a user that is not in friend list (Error Flow)

When the user requests to remove "No Doe" with email "no.doe@mail.mcgill.ca" from their friend list
Then a "User not found" error message is issued
And the user's friend list is unchanged
