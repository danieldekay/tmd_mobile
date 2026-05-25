# Spec: WordPress Pages

## Requirement: WordPress Page Display

The app SHALL display individual WordPress pages at `/pages/[slug]` backed by `/wp-json/wp/v2/pages`.

### Scenario: Page loads by slug

- WHEN the user navigates to `/pages/[slug]` and the endpoint returns a matching page
- THEN the app shows the page title and rendered HTML body content

### Scenario: Page is loading

- WHEN the page content request is in flight
- THEN the app shows a skeleton loading state without hiding navigation

### Scenario: Page not found

- WHEN the endpoint returns no page matching the slug
- THEN the app shows a "Page not found" message and a link back to the home page

### Scenario: Direct-link to a WordPress page

- WHEN the user navigates directly to `/pages/[slug]`
- THEN the page is fetched client-side and rendered correctly (prerender = false)

### Scenario: Page fetch fails

- WHEN the endpoint returns an error or CORS blocks the request
- THEN the app shows an error message with a fallback link to the main TMD website; it does not crash
