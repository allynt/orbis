Feature: My Account

  I want to test the My Account functionality

  Background:
    Given I am logged in
    When I click the "Browse Map" button
    When I click the "Profile" icon button

  Scenario: View Personal Details Side Menu
    Then I see the "Personal Details" panel

  Scenario: Update User Acount with no values
    When I submit the "Update Account" form
    Then "Update User" form not submitted as submit button disabled

  # Scenario: Request Help

  # Scenario: Read Terms & Conditions
