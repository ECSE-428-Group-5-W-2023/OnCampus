Feature: Sending Friend Requests

As an OnCampus User
I would like to be able to accept friend requrests that were sent to me
So that I can connect with other users

Scenario Outline: Accept Friend Request (Normal Flow)
Given the user opens the friend request page 
And a friend request has been sent to the user
When the user accepts the friend request
Then a connection between the two users has been created 

Scenario Outline: Decline Friend Request (Alternate Flow) 
Given the user opens the friend request page 
And a friend request has been sent to the user
When the user declines the friend request
Then a connection between the two users has not been created 

