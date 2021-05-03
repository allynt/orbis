Feature: Reset Password

  I want to test the Logout functionality

  Background:
    Given I am on the "/accounts/password/reset" page

  Scenario: View Password Reset Form
    Then I see the "Password Reset" page

  Scenario: Submit Password Reset with no values
    When I submit the "Reset Password" form
    Then "Password Reset" form not submitted as submit button disabled

  Scenario Outline: Submit Password Reset with invalid email
    When I type "<email>" into the "Email" field
    When I submit the "Reset Password" form
    Then I see the "Email address is invalid" error
    Then "Password Reset" form not submitted as submit button disabled

    Examples:
      | email     |
      | test      |
      | test@     |
      | test@test |
      | @test     |
      | test.com  |
      | @test.com |

  Scenario: Submit Password Reset with unknown email
    When I type "unknown@temp.com" into the "Email" field
    When I submit the "Reset Password" form
    When I see the "The e-mail address is not assigned to any user account" error

  Scenario: Submit successful Password Reset
    When I type "admin@test.com" into the "Email" field
    When I submit the "Reset Password" form
# Then I am redirected to the "Login" page with url "/login"
