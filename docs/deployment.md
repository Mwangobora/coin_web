# Deployment

## Requirements

- Node.js compatible with Next.js 16
- Backend available through HTTPS
- Backend CORS configured with this app origin through
  `PUBLIC_CUSTOMER_WEB_ORIGIN`

## Environment

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api/v1
```

## Build

```bash
npm ci
npm run build
npm run start
```

## Backend Endpoints

The deployed app requires:

- `POST /api/v1/public/charging/qr/resolve`
- `GET /api/v1/public/charging/packages`
- `POST /api/v1/public/charging/payments`
- `GET /api/v1/public/charging/payments/:paymentReference/status`
- `POST /api/v1/public/charging/sessions/:sessionReference/access-code`
- `GET /api/v1/public/charging/sessions/:sessionReference`

Do not deploy this customer app on the same route space as the admin dashboard.
