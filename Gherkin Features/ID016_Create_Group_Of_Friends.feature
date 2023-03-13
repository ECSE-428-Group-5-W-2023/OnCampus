Feature: Create a group of friends 

As an OnCampus User
  I would like to create a group of friends 
  So that I can keep share my schedule to a group of friends that I wish

  Background:
    Given the user is logged in the OnCampus system
    And the user is viewing their friend groups page
    And the user has email as <email>

  Scenario Outline: Create a new group of friends event (Normal Flow)
    When the user requests to create a new group of friends
    Then a new <group_id> is generated with <email> as a member
    Then a new friend group is created with <group_id> and <email>

    | group_id | member | 
    |      001 |   mohamed.mohamed5@mail.mcgill.ca | 
    |      002 |     nazia.chowdhury@mail.mcgill.ca |
    |      003 |     mona.kalaoun@mail.mcgill.ca |
    |      004 |     yu.a.lu@mail.mcgill.ca | 

  
  Scenario Outline: Create another new group of friends event (Normal Flow)
    And the user already has a group of friends with <group_id> and <email>
    And the following group of friends exist
    | group_id | member | 
    |      001 |   mohamed.mohamed5@mail.mcgill.ca | 
    |      002 |     nazia.chowdhury@mail.mcgill.ca |
    |      003 |     mona.kalaoun@mail.mcgill.ca |
    |      004 |     yu.a.lu@mail.mcgill.ca | 

    When the user requests to create a new group of friends
    Then a new friend group is created with a new <new_group_id> and <email>

    Examples:
    | group_id | member | 
    |      001 |   mohamed.mohamed5@mail.mcgill.ca | 
    |      002 |     nazia.chowdhury@mail.mcgill.ca |
    |      003 |     mona.kalaoun@mail.mcgill.ca |
    |      004 |     yu.a.lu@mail.mcgill.ca | 
    |      005 |   mohamed.mohamed5@mail.mcgill.ca | 


  Scenario Outline: Create a new group of friends event malfunction with wrong creator (Error Flow)
    When the user requests to create a new group of friends with ANOTHER_EMAIL as the creator  
    Then an "Invalid group creator, the creator of the friend group must be yourself" message is issued

