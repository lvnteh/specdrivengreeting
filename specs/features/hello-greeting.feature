Feature: Seasonal greeting

  The greeting endpoint returns the nearest holiday greeting within a 10-day window.
  If no holiday is within range, it returns "Hello World".
  An optional ?date parameter overrides the server clock (2026 only).

  # ---------------------------------------------------------------------------
  # Holiday scenarios — each holiday returns the correct greeting on its date
  # ---------------------------------------------------------------------------

  Scenario Outline: Today is a holiday
    When I call GET hello with date "<date>"
    Then the status is 200
    And the greeting is "<greeting>"
    And the holiday is "<holiday>"
    And daysUntil is 0

    Examples:
      | date       | greeting                              | holiday                        |
      | 2026-01-01 | Happy New Year!                       | New Year's Day                 |
      | 2026-01-19 | Happy Martin Luther King Jr. Day!     | Martin Luther King Jr. Day     |
      | 2026-02-17 | Happy Lunar New Year!                 | Lunar New Year                 |
      | 2026-02-14 | Happy Valentine's Day!                | Valentine's Day                |
      | 2026-03-03 | Happy Holi!                           | Holi                           |
      | 2026-03-17 | Happy St. Patrick's Day!              | St. Patrick's Day              |
      | 2026-04-05 | Happy Easter!                         | Easter                         |
      | 2026-04-22 | Happy Earth Day!                      | Earth Day                      |
      | 2026-05-05 | Happy Cinco de Mayo!                  | Cinco de Mayo                  |
      | 2026-05-10 | Happy Mother's Day!                   | Mother's Day                   |
      | 2026-06-19 | Happy Juneteenth!                     | Juneteenth                     |
      | 2026-06-21 | Happy Midsummer!                      | Midsummer / Summer Solstice    |
      | 2026-07-04 | Happy Independence Day!               | Independence Day               |
      | 2026-07-14 | Bonne Fête Nationale!                 | Bastille Day                   |
      | 2026-08-29 | Happy Raksha Bandhan!                 | Raksha Bandhan                 |
      | 2026-08-15 | Happy Obon!                           | Obon                           |
      | 2026-09-07 | Happy Labor Day!                      | Labor Day                      |
      | 2026-09-11 | Shanah Tovah!                         | Rosh Hashanah                  |
      | 2026-11-08 | Happy Diwali!                         | Diwali                         |
      | 2026-10-31 | Happy Halloween!                      | Halloween                      |
      | 2026-11-01 | Feliz Día de los Muertos!             | Día de los Muertos             |
      | 2026-11-26 | Happy Thanksgiving!                   | Thanksgiving                   |
      | 2026-12-04 | Happy Hanukkah!                       | Hanukkah                       |
      | 2026-12-25 | Merry Christmas!                      | Christmas                      |

  # ---------------------------------------------------------------------------
  # Window boundary cases
  # ---------------------------------------------------------------------------

  Scenario Outline: Boundary — within 10-day window
    When I call GET hello with date "<date>"
    Then the status is 200
    And the greeting is "<greeting>"
    And the holiday is "<holiday>"
    And daysUntil is <daysUntil>

    Examples:
      | date       | greeting         | holiday   | daysUntil |
      | 2026-12-15 | Merry Christmas! | Christmas | 10        |

  Scenario: Boundary — 11 days before Christmas is outside Christmas window, shows Hanukkah instead
    When I call GET hello with date "2026-12-14"
    Then the status is 200
    And the greeting is "Happy Hanukkah!"
    And the holiday is "Hanukkah"
    And daysUntil is -10

  # ---------------------------------------------------------------------------
  # Tie-break cases — equidistant holidays, upcoming wins
  # ---------------------------------------------------------------------------

  Scenario Outline: Tie-break — equidistant holidays, upcoming wins
    When I call GET hello with date "<date>"
    Then the status is 200
    And the greeting is "<greeting>"
    And the holiday is "<holiday>"
    And daysUntil is <daysUntil>

    Examples:
      | date       | greeting                           | holiday                     | daysUntil |
      | 2026-06-20 | Happy Midsummer!                   | Midsummer / Summer Solstice | 1         |
      | 2026-07-09 | Bonne Fête Nationale!              | Bastille Day                | 5         |
      | 2026-09-09 | Shanah Tovah!                      | Rosh Hashanah               | 2         |

  # ---------------------------------------------------------------------------
  # Fallback — no holiday within 10 days
  # ---------------------------------------------------------------------------

  Scenario Outline: Fallback — no holiday within window returns Hello World
    When I call GET hello with date "<date>"
    Then the status is 200
    And the greeting is "Hello World"
    And the holiday is null
    And daysUntil is null

    Examples:
      | date       |
      | 2026-07-26 |
      | 2026-01-30 |

  # ---------------------------------------------------------------------------
  # Date parameter — valid
  # ---------------------------------------------------------------------------

  Scenario: Date param — valid 2026 fallback date returns Hello World
    When I call GET hello with date param "2026-07-26"
    Then the status is 200
    And the greeting is "Hello World"
    And the holiday is null
    And daysUntil is null

  Scenario Outline: Date param — valid 2026 date returns correct greeting
    When I call GET hello with date param "<date>"
    Then the status is 200
    And the greeting is "<greeting>"
    And the holiday is "<holiday>"
    And daysUntil is <daysUntil>

    Examples:
      | date       | greeting         | holiday   | daysUntil |
      | 2026-12-25 | Merry Christmas! | Christmas | 0         |

  # ---------------------------------------------------------------------------
  # Date parameter — invalid
  # ---------------------------------------------------------------------------

  Scenario Outline: Date param — invalid input returns 400
    When I call GET hello with date param "<date>"
    Then the status is 400
    And the error is "<error>"

    Examples:
      | date       | error                    |
      | banana     | Nem valid datum, BLEGH   |
      | 2025-12-25 | A Dátum csak idei lehet. |
      | 2027-01-01 | A Dátum csak idei lehet. |
