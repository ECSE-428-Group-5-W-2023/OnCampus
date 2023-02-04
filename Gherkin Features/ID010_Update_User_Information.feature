Feature: Update User Information

As a OnCampus User
I would like to change my personal information such as my name, password, username, school, profile picture
So that I can keep my information up to date

Scenario Outline: Update Name (Normal Flow)
Given user <name> with username <username> opens their profile page
And the following information are shown on the page:
| username | email | name | password | school | profile_picture |
| JD | john.doe@mail.mcgill.ca| John Doe | 1234 | McGill University | JD.png |
When user <username> requests a name change for their account to the OnCampus Management System and the <name> is updated
Then the following account information are shown on the profile page of the user:
| username | email | name | password | school | profile_picture |
| JD | john.doe@mail.mcgill.ca| Jonathan Doe | 1234 | McGill University | JD.png |

Scenario Outline: Name Contains Numbers (Error Flow)

Given John Doe updates his account name field to NAME_WITH_NUMBERS 
When John Doe submits the form to the OnCampus Management System
Then an "Invalid request" message is issued
And the user's name should not be updated

Scenario Outline: Name Contains Special Characters (Error Flow)

Given John Doe updates his account name field to NAME_WITH_SPECIAL_CHARACTERS 
When John Doe submits the form to the OnCampus Management System
Then an "Invalid request" message is issued
And the user's name should not be updated
