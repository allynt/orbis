Feature: My Account

  I want to test the My Account functionality

  Background:
    Given I am logged in
    When I click the "browse-map" button by test id
    When I click the "toolbar-item-Account" button by test id

  Scenario: View My Account Side Menu
    Then I see the "My Account" panel

  Scenario: Update User Acount with no values
    When I submit the "Update Account" form
    Then "Update User" form not submitted as submit button disabled

  Scenario: Request Help

  Scenario: Read Terms & Conditions
