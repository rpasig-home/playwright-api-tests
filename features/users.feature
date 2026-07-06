@regression
Feature: JSONPlaceholder Users API

  @smoke
  Scenario: List users successfully
    When I request the list of users
    Then the response status should be 200
    And the response should contain users

  @smoke
  Scenario: Get a single user successfully
    When I request user with id "2"
    Then the response status should be 200
    And the user response should match the user schema

  Scenario: Create a user successfully
    Given I have a valid user payload
    When I send a request to create the user
    Then the response status should be 201
    And the response should contain the created user details

  Scenario: Update a user successfully
    Given I have an updated user payload
    When I send a request to update user with id "2"
    Then the response status should be 200
    And the response should contain the updated user details

  Scenario: Delete a user successfully
    When I send a request to delete user with id "2"
    Then the response status should be 200

  Scenario: User is not found
    When I request user with id "999"
    Then the response status should be 404