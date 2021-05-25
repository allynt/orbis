Feature: Bookmarks

  I want to test the Bookmark functionality

  Background:
    Given I am logged in
    When I click the "Browse Map" button
    When I click the "My maps" icon button

  Scenario: View My Maps Side Menu
    Then I see the "Bookmarks" panel

  Scenario: Bookmark place with no values
    When I submit the "Save New Map" form
    Then "Add Bookmark" form not submitted as submit button disabled

  Scenario: Add new Bookmark without description
    When I type "Test Title" into the "Title" field
    When I submit the "Save New Map" form
    Then I see the new "Test Title" Bookmark

  Scenario: Add new Bookmark with existing "Title"
    When I type "Test Title" into the "Title" field
    When I type "Test Description" into the "Description" field
    When I submit the "Save New Map" form
    Then I see the "400 Bad Request" error

  Scenario: Add new Bookmark with description
    When I type "Test Title 2" into the "Title" field
    When I type "Test Description" into the "Description" field
    When I submit the "Save New Map" form
    Then I see the new "Test Title 2" Bookmark with description "Test Description"

