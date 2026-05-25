# Tasks: Fetch All TMD Content

## Task Group: Blog post listing & detail

- [x] Fetch `/wp-json/wp/v2/posts` and display blog post list at `/blog`
- [x] Create `/blog/[slug]` detail page with rendered HTML from WordPress
- [x] Wire blog links into footer navigation

## Task Group: WordPress page display

- [x] Fetch `/wp-json/wp/v2/pages` and display pages at `/pages/[slug]`
- [x] Add loading and error states for WordPress page fetches
- [x] Add empty state and retry for WordPress page errors

## Task Group: Teacher & relationship data

- [x] Fetch and display teacher directory from TMD Core at `/teachers`
- [x] Add teacher detail page with bio, style, linked events
- [x] Show DJ relationships and connected events on event detail page
- [x] Wire teacher and DJ links into footer navigation
- [x] Add offline fallback for teacher/relationship endpoint failures
