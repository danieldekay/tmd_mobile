# Tasks: Phase 5 — Production Readiness

## 1. Domain and DNS

- [ ] 1.1 Add `mobile.tangomarathons.com` CNAME/A record pointing to Cloudflare in the DNS zone for `tangomarathons.com`
- [ ] 1.2 Bind the `mobile.tangomarathons.com` route to the `tmd-mobile` Worker service in the Cloudflare dashboard

## 2. CORS Confirmation

- [ ] 2.1 Confirm TMD Core CORS plugin/filter allows `https://mobile.tangomarathons.com` as an allowed origin
- [ ] 2.2 Test a live API request from the production domain to `/wp-json/tmd/v3/events` and confirm no CORS error

## 3. GitHub Actions Deployment

- [ ] 3.1 Add `CLOUDFLARE_API_TOKEN` to the GitHub repository secrets
- [ ] 3.2 Run the deployment workflow against the production branch and confirm `wrangler deploy` exits 0
- [ ] 3.3 Verify the deployed build serves the correct app version at `https://mobile.tangomarathons.com`

## 4. Analytics

- [ ] 4.1 Confirm analytics platform (Matomo self-hosted or defer)
- [ ] 4.2 Create a Matomo site for `mobile.tangomarathons.com` if available
- [ ] 4.3 Add analytics integration to `src/lib/analytics.ts` with opt-out support
- [ ] 4.4 Write privacy notice copy covering analytics data collection
- [ ] 4.5 Ensure analytics script is not loaded when the user has opted out

## 5. Monitoring

- [ ] 5.1 Configure uptime monitoring (Cloudflare Health Checks or UptimeRobot) for `https://mobile.tangomarathons.com`
- [ ] 5.2 Verify alert notification reaches the operator on a simulated downtime

## 6. Documentation

- [ ] 6.1 Update `DEPLOY.md` with production checklist: DNS, CORS, GitHub Actions, analytics, smoke tests
- [ ] 6.2 Document the Cloudflare Worker route and service name for future operators

## 7. Smoke Tests

- [ ] 7.1 Open `https://mobile.tangomarathons.com/events` and confirm the event list loads from production TMD Core
- [ ] 7.2 Open an event detail page directly by URL and confirm SPA fallback routing works
- [ ] 7.3 Confirm the PWA is installable on iOS Safari and Android Chrome
