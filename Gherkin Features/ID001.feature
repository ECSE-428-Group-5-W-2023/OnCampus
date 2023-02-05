ID001: 
Feature: Creating new user account 

As an OnCampus User
I would like to create an account in the OnCampus system
So that I could access the features of the system

Scenario Outline: User creates an account with a unique email and fills in all the required fields (Normal Flow) 

When a new user attempts to create an account with with <email>, <username>, <password>, <name>, and <school>
Then a new user account shall exist with <email>, <username>, <password>, <name>, and <school>

| email                            | username   | password  | name              | school            |
| nikolas.pasichnik@mail.mcgill.ca | nikolas_p  | np001     | Nikolas Pasichnik | McGill University |
| nazia.chowdhury@mail.mcgill.ca   | nazia_c    | nc002     | Nazia Chowdhury   | McGill University |
| mona.kalaoun@mail.mcgill.ca      | mona_k     | mk003     | Mona Kalaoun      | McGill University |
| yu.a.lu@mail.mcgill.ca           | yu_an_l    | yl004     | Yu An Lu          | McGill University |

Scenario Outline: User creates an account with an already used email (Error Flow)

When a new user attemps to create an account with EXISTING_EMAIL, <username>, <password>, <name>, and <school>
Then a "This email is already in use" error message is issued 

Scenario Outline: User creates an account without an email (Error Flow) 

When a new user attempts to create an account with EMPTY_STRING, <username>, <password>, <name>, and <school>
Then a "Please do not leave any blank fields" error message is issued 

Scenario Outline: User creates an account without a username (Error Flow) 

When a new user attempts to create an account with <email>, EMPTY_STRING, <password>, <name>, and <school>
Then a "Please do not leave any blank fields" error message is issued 

Scenario Outline: User creates an account without a password (Error Flow) 

When a new user attempts to create an account with <email>, <username>, EMPTY_STRING, <name>, and <school>
Then a "Please do not leave any blank fields" error message is issued 

Scenario Outline: User creates an account without a name (Error Flow) 

When a new user attempts to create an account with <email>, <username>, <password>, EMPTY_STRING, and <school>
Then a "Please do not leave any blank fields" error message is issued 

Scenario Outline: User creates an account without a school (Error Flow) 

When a new user attempts to create an account with <email>, <username>, <password>, <name>, and EMPTY_STRING
Then a "Please do not leave any blank fields" error message is issued 

