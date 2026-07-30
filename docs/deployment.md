# Deployment

## Requirements

- Node.js compatible with Next.js 16
- Backend available through HTTPS for remote mode
- Backend CORS configured with the public customer web origin

## Environment

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api/v1
NEXT_PUBLIC_USE_MOCK_API=false
```

Use mock mode for demos that should not call the backend:

```bash
NEXT_PUBLIC_USE_MOCK_API=true
```

## Build

```bash
npm ci
npm run build
npm run start
```

## Backend Endpoint

Phase 1 requires only:

```text
POST /api/v1/public/charging/qr/resolve
```

Do not deploy this customer app on the same route space as the admin dashboard.
