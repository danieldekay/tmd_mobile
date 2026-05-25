# Newsletter Signup Specification

## ADDED Requirements

### Requirement: Newsletter Signup Page

The app SHALL serve a `/newsletter` page with a form that allows visitors to subscribe to email updates.

#### Scenario: Newsletter signup page route resolves

- **WHEN** a user navigates to `/newsletter`
- **THEN** the page renders with a signup form and relevant messaging

#### Scenario: Signup form has an email input field

- **WHEN** a user views the signup form
- **THEN** an `<input type="email">` field is displayed with a placeholder like "your@email.com"

#### Scenario: Signup form has a submit button

- **WHEN** a user views the signup form
- **THEN** a "Subscribe" or "Sign Up" button is visible beside or below the email input

#### Scenario: Form shows loading state during submission

- **WHEN** a user submits the form and the API call is in progress
- **THEN** the submit button shows a loading state and is disabled to prevent double-submission

### Requirement: Email Validation

The app SHALL validate the entered email address format on the client before submitting.

#### Scenario: Empty email is rejected

- **WHEN** a user submits the form without entering an email
- **THEN** the submission is blocked and a "Please enter your email" message is shown

#### Scenario: Invalid email format is rejected

- **WHEN** a user enters an email without `@domain` format
- **THEN** the submission is blocked and a "Please enter a valid email address" message is shown

#### Scenario: Valid email passes validation

- **WHEN** a user enters a properly formatted email
- **THEN** the submission proceeds to the server

### Requirement: Sendy Integration (Optional)

The app SHALL integrate with the Sendy email marketing API when `PUBLIC_SENDY_URL` and `PUBLIC_SENDY_API_KEY` are configured.

#### Scenario: Signup requests Sendy API

- **WHEN** a user subscribes from the newsletter signup form
- **THEN** a `POST` request is sent to the Sendy API endpoint with the email and a configured list parameter

#### Scenario: Sendy success shows confirmation

- **WHEN** Sendy returns a success response (or `Already subscribed`)
- **THEN** a success confirmation message is displayed to the user

#### Scenario: Sendy error shows failure message

- **WHEN** Sendy returns an error (e.g., 4xx or 5xx)
- **THEN** an error message is displayed explaining the subscription failed

#### Scenario: Missing Sendy config is handled gracefully

- **WHEN** `PUBLIC_SENDY_URL` is not configured
- **THEN** the signup form either redirects to an external newsletter signup page or displays a message indicating the feature is unavailable

### Requirement: Unsubscribe Flow

The app SHALL provide an unsubscribe mechanism accessible from the newsletter signup page.

#### Scenario: Unsubscribe link is visible on the newsletter page

- **WHEN** a user loads `/newsletter`
- **THEN** an "Unsubscribe" link is displayed alongside the signup form

#### Scenario: Unsubscribe link directs to external Sendy unsubscribe page

- **WHEN** a user clicks the unsubscribe link
- **THEN** they are redirected to an external URL (e.g., `https://sendy-server/unsubscribe?list=...&email=...`)

### Requirement: Analytics Logging

The app SHALL log newsletter page views and signup events for analytics (respects consent gating).

#### Scenario: Newsletter page view is tracked

- **WHEN** a user loads the `/newsletter` page
- **THEN** a page view event is tracked via the analytics module (if consent is given)

#### Scenario: Successful signup event is tracked

- **WHEN** a user successfully subscribes
- **THEN** an event such as `Newsletter → Subscribe` is tracked via the analytics module (if consent is given)

#### Scenario: Failed signup event is not tracked

- **WHEN** a user's subscription attempt fails
- **THEN** no analytics event is recorded for that failed attempt
