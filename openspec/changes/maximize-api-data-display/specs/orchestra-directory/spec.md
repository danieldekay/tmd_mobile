## NEW Requirements

### Requirement: Orchestra Directory List

The app SHALL provide a browsable orchestra list at `/orchestras`.

#### Scenario: Orchestra list loads successfully

- **GIVEN** the TMD Core orchestras endpoint returns orchestra records
- **WHEN** the user opens /orchestras
- **THEN** the app shows each orchestra's name, city, country, and active years when available

#### Scenario: Orchestra active years display

- **GIVEN** an orchestra has `orchestra_first_year` and `orchestra_last_year`
- **WHEN** the list card renders
- **THEN** active years are shown as "YYYY – YYYY" or "YYYY – present"

#### Scenario: Orchestra list is empty

- **WHEN** the endpoint returns no orchestra records
- **THEN** the app shows an empty state message

### Requirement: Orchestra Navigation

- **WHEN** the user taps the Orchestras nav item
- **THEN** the app navigates to /orchestras
