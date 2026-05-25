# Tasks: Newsletter Signup

## Task Group: Newsletter page layout

- [ ] Create `src/routes/newsletter/+page.svelte` with email form, subscribe button, unsubscribe link
- [ ] Wire newsletter link into `src/routes/+layout.svelte` header nav

## Task Group: Newsletter signup component

- [ ] Create `src/lib/components/NewsletterSignup.svelte` component with email validation + success/error
- [ ] Wire `NewsletterSignup` into `src/routes/newsletter/+page.svelte` page body
- [ ] Add unsubscribe link to `NewsletterSignup` component with endpoint and email parameter
- [ ] Wire `NewsletterSignup` into `src/routes/newsletter/+page.svelte` page body

## Task Group: Integration + polish

- [ ] Add unsubscribe link + `Unsubscribe` endpoint to Matomo tracking
- [ ] Wire `NewsletterSignup` into `+page.svelte` footer
- [ ] Wire `NewsletterSignup` into `src/lib/components/PwaInstallCard.svelte` component
- [ ] Add unit tests for `NewsletterSignup.svelte` components with subscribe, unsubscribe, error handling
