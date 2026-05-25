# Tasks: Maximize API Data Display

## Task Group: Event detail page

- [ ] Enrich event detail page with all TMD Core v3 data fields (title, dates, venue, categories, badges, price, image, description, address, contacts, social, DJs, teachers, series)
- [ ] Add loading and error states to event detail page with skeleton and retry button
- [ ] Wire `src/lib/components/EventsList.svelte` to fetch and display events from TMD Core v3

## Task Group: Blog post display

- [ ] Create `/blog` listing page fetching from WordPress REST API with title, excerpt, date
- [ ] Create `/blog/[slug]` detail page with sanitized rendered HTML using DOMPurify
- [ ] Wire newsletter signup into footer links

## Task Group: DJ & teacher display

- [ ] Enhance DJ detail page with full data: bio, style, social links, connected events
- [ ] Enhance teacher detail page with profile image, bio, connected events
