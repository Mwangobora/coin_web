# Charge Link Customer Web

Public browser application for QR-code mobile charging. Customers scan the QR
code on a charging machine, choose a package, pay, receive a one-time locker
PIN, and track the charging session.

This app is separate from the admin dashboard and uses only public customer
backend APIs under `/api/v1/public/charging`.

## Environment

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
```

Do not put secrets in `NEXT_PUBLIC_*` variables.

## Local Development

```bash
npm install
npm run dev
```

Open a QR URL such as:

```text
http://localhost:3000/charge/{opaqueQrToken}
```

## Validation

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run check:lines
```
