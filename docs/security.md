# Security

## Browser Storage

The app may store temporary checkout and customer flow tokens in
`sessionStorage`. It never stores the plaintext locker PIN in `localStorage` or
`sessionStorage`.

The PIN is held only in React component state on the display screen. After the
customer confirms that the PIN is saved, the PIN is removed from the rendered
page. Reopening the session page cannot reveal the PIN again.

## Tokens

Checkout tokens are sent with `X-Checkout-Token`. Customer flow tokens are sent
with `X-Customer-Flow-Token`. Tokens are not placed in URLs.

## API Safety

Route parameters are validated before API calls. Backend responses are parsed
with Zod. The app does not render raw HTML from API responses and does not call
admin APIs.

## Headers

Next.js adds security headers for frame denial, content sniffing protection,
referrer policy, and restricted permissions. Session routes use `no-store`.

## Current Limitation

The backend queues `charging.prepare` commands only after PIN claim. Firmware
support for remote command polling, verifier comparison, deposit confirmation,
and collection completion must be completed separately.
