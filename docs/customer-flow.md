# Customer Flow

## QR URL

Machine QR codes open:

```text
https://customer.example.com/charge/{opaqueQrToken}
```

The token is opaque. It must not contain device IDs, station IDs, credentials,
locker numbers, prices, or durations.

## Phase 1 Steps

1. Customer scans the QR code.
2. The app validates the route token format.
3. The app resolves the token through `POST /public/charging/qr/resolve`.
4. The app shows the public station and device information.
5. The app shows locker and charging-port availability.
6. The app shows backend-provided charging packages.
7. Customer selects one package.
8. Continue shows the Phase 1 payment-integration placeholder.

Payment, access-code claim, and live session tracking are planned for later
phases and are not implemented here.

Coin users do not need this web application. They insert the supported coin
directly into the machine and follow the device instructions.
