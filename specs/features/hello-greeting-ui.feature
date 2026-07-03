Feature: Greeting UI

  The greeting page renders two cards:
  1. "Right now" — loads today's greeting from the server on page open.
  2. "Pick a date" — native date picker constrained to 2026; pressing Go shows the greeting.
  Errors are surfaced as a toast notification.

  # ---------------------------------------------------------------------------
  # Scenario 1 — Page loads and shows today's greeting
  # ---------------------------------------------------------------------------

  Scenario: Page loads showing today's greeting
    Given I open the greeting page
    Then a non-empty greeting is visible in the now card

  # ---------------------------------------------------------------------------
  # Scenario 2 — Picking a holiday date shows the correct greeting
  # ---------------------------------------------------------------------------

  Scenario: Picking a valid 2026 holiday date shows its greeting
    Given I open the greeting page
    When I pick the date "2026-12-25" and press Go
    Then the picked greeting shows "Merry Christmas!"
    And the picked meta contains "Christmas"

  # ---------------------------------------------------------------------------
  # Scenario 3 — Picking a date with no nearby holiday shows Hello World
  # ---------------------------------------------------------------------------

  Scenario: Picking a date with no nearby holiday shows Hello World
    Given I open the greeting page
    When I pick the date "2026-07-26" and press Go
    Then the picked greeting shows "Hello World"
    And no holiday is shown in the picked meta

  # ---------------------------------------------------------------------------
  # Scenario 4 — API error shows a toast
  # ---------------------------------------------------------------------------

  Scenario: API error shows a toast notification
    Given I open the greeting page
    When I pick the date "2026-13-01" and press Go
    Then a toast message is visible
