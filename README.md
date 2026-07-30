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
/charge/DEMO-CHARGER-ONLINE
/charge/DEMO-CHARGER-OFFLINE
/charge/DEMO-CHARGER-MAINTENANCE
/charge/DEMO-INVALID
```

## Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run check:lines
```

## Remote API

Phase 1 calls:

```text
POST /api/v1/public/charging/qr/resolve
```

The backend remains authoritative for station state, device state, locker and
port availability, package pricing, and package duration.
