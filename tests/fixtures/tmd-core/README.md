# TMD Core Event Fixtures

These fixtures document the current API contract for TMD Mobile development.

## Captured Fixtures

- `events.production-auth-required.json`: production TMD Core currently returns `401 rest_not_logged_in` for anonymous v3 event list requests.
- `events.local-unavailable.json`: local `localhost:10014` was not reachable when this project was initialized.

## Expected Success Shape

- `events.expected-success.json`: inferred from TMD Core controller code. Use this as the normalization target until a successful local or production response can be captured.

## Re-capture Commands

```bash
nvm use
node -e "const url='https://www.tangomarathons.com/wp-json/tmd/v3/events?per_page=2&include_relationships=true&future=1'; const res=await fetch(url,{headers:{accept:'application/json'}}); console.log(res.status, res.headers.get('content-type')); console.log(await res.text());"
node -e "const url='http://localhost:10014/wp-json/tmd/v3/events?per_page=2&include_relationships=true&future=1'; const res=await fetch(url,{headers:{accept:'application/json'}}); console.log(res.status, res.headers.get('content-type')); console.log(await res.text());"
```

When public read or JWT-backed mobile access is ready, replace the current captured fixtures with successful response fixtures from both environments.
