# Security

## Browser Storage

Phase 1 does not store checkout state, customer tokens, access codes, or
charging-session data in browser storage.

## Tokens

The QR token remains an opaque route parameter. It is validated before the
repository call and is not logged by the API client.

## API Safety

Backend responses are parsed with Zod before they reach UI components. The app
does not render raw HTML from API responses and does not call admin APIs.

## Headers

Next.js adds frame denial, content sniffing protection, referrer policy, and
restricted permissions headers.

## Current Limitation

Payment, locker access-code claim, command preparation, and session tracking
belong to later phases.
