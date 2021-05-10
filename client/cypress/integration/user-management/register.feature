Feature: Register

  I want to test the Register functionality

  Background:
    Given I am on the "/accounts/register" page
    When I click the "Team" checkbox label
    When I click the "Continue" button

  Scenario: View registration page
    Then I see the "Registration" page

  Scenario: Submit registration with no values
    When I submit the "Sign Up" form
    Then "Register" form not submitted as submit button disabled

  Scenario Outline: Submit registration with invalid email
    When I type "<email>" into the "Email" field
    When I type "testpwtest" into the "Password" field
    When I type "testpwtest" into the "Password Confirmation" field
    When I submit the "Sign Up" form
    Then I see the "Email address is invalid" error
    Then "Register" form not submitted as submit button disabled

    Examples:
      | email     |
      | test      |
      | test@     |
      | test@test |
      | @test     |
      | test.com  |
      | @test.com |

  Scenario: Submit registration with email that already exists
    When I type "test@test.com" into the "Email" field
    When I type "testpwtest" into the "Password" field
    When I type "testpwtest" into the "Password Confirmation" field
    When I click the "I agree with" checkbox label
    When I submit the "Sign Up" form
    Then I see the "400 Bad Request" error

  Scenario: Submit registration with no confirmation password
    When I type "test@test.com" into the "Email" field
    When I type "testpas" into the "Password" field
    When I click the "I agree with" checkbox label
    When I submit the "Sign Up" form
    Then I see the "Password confirmation is required" error
    Then "Register" form not submitted as submit button disabled

  Scenario: Submit registration with passwords to short
    When I type "test@test.com" into the "Email" field
    When I type "testpas" into the "Password" field
    When I type "testpas" into the "Password Confirmation" field
    When I click the "I agree with" checkbox label
    When I submit the "Sign Up" form
    Then I see the "Password is too short" error
    Then "Register" form not submitted as submit button disabled

  Scenario: Submit registration with passwords not matching
    When I type "test@test.com" into the "Email" field
    When I type "testpwtest" into the "Password" field
    When I type "testpwte" into the "Password Confirmation" field
    When I click the "I agree with" checkbox label
    When I submit the "Sign Up" form
    Then I see the "Passwords do not match" error

  Scenario: Submit registration with password to common
    When I type "test@test.com" into the "Email" field
    When I type "password" into the "Password" field
    When I type "password" into the "Password Confirmation" field
    When I click the "I agree with" checkbox label
    When I submit the "Sign Up" form
    Then I see the "400 Bad Request" error

  Scenario: Submit registration without agreeing the terms
    When I type "test@test.com" into the "Email" field
    When I type "testpwtest" into the "Password" field
    When I type "testpwtest" into the "Password Confirmation" field
    When I submit the "Sign Up" form
    Then "Register" form not submitted as submit button disabled

  # FIXME: Do not uncomment until we have setup/tear-down working correctly
  # Scenario: Submit successful registeration
  #   When I type "test1@test.com" into the "Email" field
  #   When I type "testpwtest" into the "Password" field
  #   When I type "testpwtest" into the "Password Confirmation" field
  #   When I click the "I agree with" checkbox label
  #   When I submit the "Sign Up" form
  #   Then I am redirected to the "Login" page with url "/login"

  Scenario: Click "Terms & Conditions" link
    When I click the "Terms & Conditions" link
    Then The "Terms & Conditions" page will open url "/terms" in a new tab

  @focus
  Scenario: Click "Login" link
    When I click the "Login" link
    Then I am redirected to the "Login" page with url "/login"
