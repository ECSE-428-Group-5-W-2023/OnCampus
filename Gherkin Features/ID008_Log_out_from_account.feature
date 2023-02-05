Feature: Log out from account

As an OnCampus user
    I would like to be able to log out of my account
    So that I can keep my personal information safe and allow other users to use the device I am using

Scenario: User logs out (Normal Flow)

    Given the user is logged into the onCampus Software system
    When the user clicks on the logout button
    Then personal information from the user is no longer displayed
    And cached personal information on the device is deleted

Scenario: User logs out while creating or editing an event

    Given the user is logged into the onCampus Software system
    And the user is in the process of creating or editing an event
    And has unsaved changes
    When the user clicks on the logout button
    Then a confirmation prompt is displayed with a "Yes, I'm sure" and a "Cancel" button
    And the user clicks  "Yes, I'm sure"
    Then personal information from the user is no longer displayed
    And cached personal information on the device is deleted

Scenario: User accidentally logs out while creating or editing an event 

    Given the user is logged into the onCampus Software system
    And the user is in the process of creating or editing an event
    And has unsaved changes
    When the user clicks on the logout button
    Then a confirmation prompt is displayed with a "Yes, I'm sure" and a "Cancel" button
    And the user clicks  "Cancel"
    Then the prompt disappears and the user is still logged in
    
