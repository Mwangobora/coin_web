# Customer Flow

## QR URL

Machine QR codes open:

```text
https://customer.example.com/charge/{opaqueQrToken}
```

The token is opaque. It must not contain device IDs, station IDs, credentials,
locker numbers, prices, or durations.

## Steps

1. Customer scans the QR code.
2. The app resolves the token through `POST /public/charging/qr/resolve`.
3. The app shows station, device status, slot availability, and packages.
4. Customer selects one package.
5. Checkout calls `POST /public/charging/payments` with package ID and UUID
   idempotency key.
6. The app stores the customer flow token in `sessionStorage`.
7. Payment status polls until a terminal state.
8. After confirmation, the customer opens the session page.
9. The app claims the four-digit locker PIN once.
10. Customer saves the PIN, enters it on the machine, inserts the phone, and
    tracks the session.
11. Charging starts only after the machine confirms the phone is deposited and
    the locker is closed.
12. The same PIN is used later for collection after charging ends.

Coin users do not need this web application. They insert the supported coin
directly into the machine and follow the LCD instructions.
