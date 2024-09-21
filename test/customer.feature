Feature: Customer Management

  Scenario: Create a new customer
    Given I have a customer
    When I create the customer
    Then I should receive the created customer

  Scenario: Get all customers
    Given there are customers in the system
    When I get all customers
    Then I should receive a list of customers