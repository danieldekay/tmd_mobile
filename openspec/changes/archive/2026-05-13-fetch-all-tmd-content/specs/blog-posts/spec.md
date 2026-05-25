## ADDED Requirements

### Requirement: Blog Post List

The app SHALL provide a browsable blog post list at `/blog` backed by `/wp-json/wp/v2/posts`.

#### Scenario: Blog list loads successfully

- **WHEN** the user opens `/blog` and the endpoint returns post records
- **THEN** the app shows each post's title, excerpt, and publication date with a link to the detail page

#### Scenario: Blog list is loading

- **WHEN** the blog list request is in flight
- **THEN** the page shows a skeleton loading state without hiding navigation

#### Scenario: Blog list is empty

- **WHEN** the endpoint returns no posts
- **THEN** the app shows an empty state message ("No blog posts available")

#### Scenario: Blog list fetch fails

- **WHEN** the endpoint returns an error or CORS blocks the request
- **THEN** the app shows an error message with a link to the main TMD website as fallback; it does not crash

### Requirement: Blog Post Detail

The app SHALL display individual blog posts at `/blog/[slug]` with rendered HTML content.

#### Scenario: Blog post loads

- **WHEN** the user navigates to `/blog/[slug]` and the endpoint returns the post
- **THEN** the app shows the post title, publication date, and rendered HTML body content

#### Scenario: Blog post is loading

- **WHEN** the blog post detail request is in flight
- **THEN** the page shows a skeleton loading state

#### Scenario: Blog post not found

- **WHEN** the endpoint returns no post matching the slug
- **THEN** the app shows a "Post not found" message and a link back to `/blog`

#### Scenario: Direct-link to blog post

- **WHEN** the user navigates directly to `/blog/[slug]` (no client-side navigation)
- **THEN** the page fetches the post client-side and renders it without a server error (prerender = false)
