Feature: Logout

  I want to test the Logout functionality

  Background:
    Given I am logged in

  Scenario: Logout of application
    When I click the "browse-map" button by test id
    When I click the "toolbar-item-Account" button by test id
    When I click the "Logout" button
    Then I am redirected to the "Login" page with url "/login"
