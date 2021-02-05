Feature: Login

  I want to test the Login functionality

  Background:
    Given I am on the "/accounts/login" page

  Scenario: View Login Form
    Then I see the "Login" page

  Scenario: Submit login with no values
    When I submit the "Login" form
    Then "Login" form not submitted as submit button disabled

  Scenario Outline: Submit login with invalid email
    When I type "<email>" into the "Email *" field
    When I type "testpwtest" into the "Password *" field
    When I submit the "Login" form
    Then I see the "Email address is invalid" error
    Then "Login" form not submitted as submit button disabled

    Examples:
      | email     |
      | test      |
      | test@     |
      | test@test |
      | @test     |
      | test.com  |
      | @test.com |

  Scenario: Submit login with unknown email
    When I type "test@test.com" into the "Email *" field
    When I type "password" into the "Password *" field
    When I submit the "Login" form
    Then I see the "Unable to log in with provided credentials." error

  Scenario: Submit login with password to short
    When I type "test@test.com" into the "Email *" field
    When I type "testpas" into the "Password *" field
    When I submit the "Login" form
    Then I see the "Password is too short (minimum 8 characters)" error

  Scenario: Submit login with wrong password
    When I type "admin@test.com" into the "Email *" field
    When I type "testpwtest" into the "Password *" field
    When I submit the "Login" form
    Then I see the "Unable to log in with provided credentials." error

  Scenario: Click "Forgot password?" link
    When I click the "password?" link
    Then I am redirected to the "Forgotten Password" page with url "/password/reset"
    Then I see "Reset Password" on the page

  Scenario: Click "Don't have an account? Sign Up" link
    When I click the "Sign Up" link
    Then I am redirected to the "Sign Up" page with url "/register"
    Then I see "Sign Up" on the page

  Scenario: Show actual password
    When I type "test@test.com" into the "Email *" field
    When I type "testpwtest" into the "Password *" field
    When I click the "icon-span" button by test id
    Then I see "testpwtest" in the "Password *" field

  Scenario: Submit successful login
    When I type "admin@test.com" into the "Email *" field
    When I type "password" into the "Password *" field
    When I submit the "Login" form
    Then I am redirected to the "Landing" page with url "/"
    Then I see "Browse Map" on the page
