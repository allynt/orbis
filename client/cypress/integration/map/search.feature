Feature: Search

  I want to test the Search functionality

  Background:
    Given I am logged in
    When I click the "Browse Map" button

  Scenario: Search for place with no results
    When I type "borishasnoclue" in the "search box"
    Then The results box displays "No results found"

  Scenario: Search for place with no results
    When I type "Easter Road" in the "search box"
    When I select "12 Albion Pl, Edinburgh, Scotland EH7 5PZ, United Kingdom" option
    Then The map zooms in to "Easter Road Stadium"

# Scenario: Search for place with multiple results
#   Given I am logged in
#   When I type "Easter Road" in the "search box"
#   When I select "12 Albion Pl, Edinburgh, Scotland EH7 5PZ, United Kingdom" option
# Then The map zooms in to "Easter Road Stadium"
