# Spec: Orchestra Directory

## Requirement: Orchestra Directory List

The app SHALL provide a browsable orchestra list at `/orchestras`.

### Scenario: Orchestra list loads successfully

- WHEN the user opens /orchestras and the endpoint returns orchestra records
- THEN the app shows each orchestra's name, city, country, and active years when available

### Scenario: Orchestra list is loading

- WHEN the orchestra list request is in flight
- THEN the page shows a skeleton loading state

### Scenario: Orchestra list is empty

- WHEN the endpoint returns no orchestra records
- THEN the app shows an empty state message

## Requirement: Orchestra Active Years Display

### Scenario: Orchestra has first and last year

- GIVEN an orchestra with `orchestra_first_year` and `orchestra_last_year`
- WHEN the list card renders
- THEN active years are shown as "YYYY – YYYY" or "YYYY – present" if last_year equals current year or is absent

## Requirement: Orchestra Navigation

The app SHALL include Orchestras as a secondary navigation item accessible from the main navigation area.

### Scenario: User navigates to Orchestras

- WHEN the user taps the Orchestras nav item or link
- THEN the app navigates to /orchestras
