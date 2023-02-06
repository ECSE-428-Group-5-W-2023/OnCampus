Feature: Log into user account with username and password


As an OnCampus user
I would like to access the OnCampus account I created through entering my correct email and password
So that I could view and edit my personal calendars/events


Scenario Outline: Existing user and correct matching password (Normal Flow)


Given user <email> with password <password> is an existing account
When user <email> requests access to their account in the OnCampus Management System using the correct password <password>
Then access to account with email <email> is granted


| name           | email                        | password |
| Archie Andrews |archie.andrews@mail.mcgill.ca |aa001     |
| Betty Cooper   |betty.cooper@mail.mcgill.ca   |cb002     |
| Jughead Jones  |jughead.jones@mail.mcgill.ca  |jj003     |
| Veronica Lodge |veronica.lodge@mail.mcgill.ca |lv004     |


Scenario Outline: User enters invalid password for an existing account (Error Flow)


Given Fred Smith uses email EXISTING_EMAIL and password INVALID_PASSWORD to request account access
When employee Fred Smith requests account access to the OnCampus Management System
Then an "Invalid email or password" message is issued


Scenario Outline: User enters non-existent account email (Error Flow)


Given Bill Jones uses email INVALID_EMAIL and password PASSWORD to request account access
When employee Fred Smith requests account access to the OnCampus Management System
Then an "Invalid email or password" message is issued
