Feature: Bookmarks

  I want to test the Bookmark functionality

  Background:
    Given I am logged in
    When I click the "browse-map" button by test id
    When I click the "toolbar-item-Maps" button by test id

  Scenario: View My Maps Side Menu
    Then I see the "Bookmarks" panel

  Scenario: Bookmark place with no values
    When I submit the "Save Bookmark" form
    Then "Add Bookmark" form not submitted as submit button disabled

  Scenario: Add new Bookmark without description
    When I type "Test Title" into the "Title" field
    When I submit the "Save Bookmark" form
    Then "Add Bookmark" form not submitted as submit button disabled

  Scenario: Add new Bookmark with existing "Title"
    When I type "Test Title" into the "Title" field
    When I type "Test Description" into the "Description" field
    When I submit the "Save Bookmark" form
    Then I see the "400 Bad Request" error

  # Scenario: Load an existing Bookmark
  #   When I click the "Load" button
  #   Then I see the

  # Scenario: Delete existing Bookmark
  #   When I click the "Delete" button
  #   Then I see the Bookmark item removed from the list

  Scenario: Successfully add new Bookmark
    When I type "Test Title" into the "Title" field
    When I type "Test Description" into the "Description" field
    When I submit the "Save Bookmark" form
    Then I see the new "Test Title" Bookmark with description "Test Description"

