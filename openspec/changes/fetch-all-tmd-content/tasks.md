## 1. Types and API Layer

- [ ] 1.1 Verify `/wp-json/tmd/v3/teachers` exists on local dev (`http://localhost:10014`) and inspect response shape
- [ ] 1.2 Add `TmdTeacher` and `TmdTeacherDetail` types to `src/lib/types.ts`
- [ ] 1.3 Add `TmdPost` and `TmdPage` types to `src/lib/types.ts` (id, slug, title.rendered, excerpt.rendered, content.rendered, date)
- [ ] 1.4 Add `wpBaseUrl` helper to `src/lib/api/tmd.ts` (same origin as `apiBaseUrl`, path prefix `/wp-json/wp/v2`)
- [ ] 1.5 Add `getTeachers(perPage?: number)` and `getTeacher(id)` functions in `src/lib/api/tmd.ts`
- [ ] 1.6 Add `getPosts(perPage?: number)` function in `src/lib/api/tmd.ts` using `?_fields=id,slug,title,excerpt,date`
- [ ] 1.7 Add `getPost(slug: string)` function using `?slug=<slug>&_fields=id,slug,title,content,date`
- [ ] 1.8 Add `getPage(slug: string)` function using `?slug=<slug>&_fields=id,slug,title,content`
- [ ] 1.9 Run `npm run check` — fix any TypeScript errors

## 2. Teacher Directory Routes

- [ ] 2.1 Create `src/routes/teachers/+page.svelte` — teacher list with loading skeleton, empty state, and error state
- [ ] 2.2 Create `src/routes/teachers/+page.ts` — client-side load calling `getTeachers()`
- [ ] 2.3 Create `src/routes/teachers/[id]/+page.svelte` — teacher detail with name, bio/description, location, and upcoming events
- [ ] 2.4 Create `src/routes/teachers/[id]/+page.ts` — client-side load calling `getTeacher(id)`, handle 404 gracefully
- [ ] 2.5 Run `npm run check` — verify no type errors in new routes

## 3. Blog Posts Routes

- [ ] 3.1 Create `src/routes/blog/+page.svelte` — blog list with post title, excerpt, date, loading/empty/error states
- [ ] 3.2 Create `src/routes/blog/+page.ts` — client-side load calling `getPosts(20)`
- [ ] 3.3 Create `src/routes/blog/[slug]/+page.svelte` — post detail rendering `{@html post.content.rendered}`
- [ ] 3.4 Create `src/routes/blog/[slug]/+page.ts` with `export const prerender = false` — load calling `getPost(slug)`, handle not-found

## 4. WordPress Pages Route

- [ ] 4.1 Create `src/routes/pages/[slug]/+page.svelte` — page detail rendering `{@html page.content.rendered}` with loading/error states
- [ ] 4.2 Create `src/routes/pages/[slug]/+page.ts` with `export const prerender = false` — load calling `getPage(slug)`, handle not-found
- [ ] 4.3 Run `npm run check` — verify no type errors

## 5. Navigation and Event Detail Updates

- [ ] 5.1 Add **Teachers** navigation link to `src/routes/+layout.svelte` (alongside DJs)
- [ ] 5.2 Add **Blog** navigation link to `src/routes/+layout.svelte`
- [ ] 5.3 Update the teacher rendering in the event detail page (`src/routes/events/[id]/+page.svelte`) to link teacher names to `/teachers/[id]` when an ID is available; keep plain text fallback

## 6. CORS Verification

- [ ] 6.1 Verify `Access-Control-Allow-Origin` header is present on `https://www.tangomarathons.com/wp-json/wp/v2/posts` (use `curl -I`)
- [ ] 6.2 If CORS is missing, create a TMD Core ticket and add a comment in the API helpers noting the dependency

## 7. Build and Deploy Validation

- [ ] 7.1 Run `npm run check` — all type checks pass
- [ ] 7.2 Run `npm run build` — static build succeeds with new routes
- [ ] 7.3 Verify teacher list, blog list, and pages routes load correctly in local dev (`npm run dev`)
- [ ] 7.4 Deploy to Cloudflare Worker with `npx wrangler deploy` and smoke-test `/teachers`, `/blog`, and `/pages/about` (or any known slug)
