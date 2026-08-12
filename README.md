# Charge Link Customer Web

Public customer website for QR-code mobile charging. A customer normally opens
this app by scanning the QR code on a physical charging machine.

This project is separate from the Admin Dashboard. It has no login, no
registration, no sidebar navigation, and no administrative APIs.

Phase 1 includes QR resolution, charger availability, package selection, mock
mode, and remote API wiring. Payment, locker access-code claim, and session
tracking are not implemented in this phase.

## Install

```bash
npm install
```

## Environment

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_USE_MOCK_API=true
```

Use `NEXT_PUBLIC_USE_MOCK_API=false` for the remote backend. Do not place
secrets in `NEXT_PUBLIC_*` variables.

## Demonstration QR URLs

```text
/charge/cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ
/charge/DEMO-CHARGER-OFFLINE
/charge/DEMO-CHARGER-MAINTENANCE
/charge/DEMO-INVALID
```

## Production QR Code

Default machine QR target:

```text
https://charging-customer-web.vercel.app/charge/cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ
```

Generated QR asset:

```text
public/qr/charging-machine-001.svg
```

Regenerate the QR after changing the Vercel domain:

```bash
PUBLIC_CUSTOMER_SITE_URL=https://your-vercel-domain.vercel.app npm run qr:generate
```

Use a unique, random QR token per physical machine.

For the current sticker/demo flow on Vercel, set:

```bash
NEXT_PUBLIC_USE_MOCK_API=true
```

This keeps the customer flow simple: scan QR, tap Start charging, choose TZS
200 or TZS 500, select Fake Money, tap Pay, then see Payment accepted.

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run check:lines
npm run qr:generate
```

## Remote API

Phase 1 calls:

```text
POST /api/v1/public/charging/qr/resolve
```

The backend remains authoritative for station state, device state, locker and
port availability, package pricing, and package duration.
