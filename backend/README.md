# MYRA authentication backend

This is a separate Node.js service for privileged-role email OTP. It is not the public website and must never be deployed as part of the Vite static bundle.

## Current endpoints

- `GET /health`
- `POST /auth/otp/request` with Firebase ID token in `Authorization: Bearer ...`
- `POST /auth/otp/verify` with the same header and JSON body `{"code":"123456"}`

The service checks Firebase ID tokens, verified email, active Firestore role, and the fixed Owner email. OTPs are generated on the server, HMAC-hashed before storage, expire quickly, have attempt limits, and are sent through the Brevo transactional email API.

## Free-tier setup

1. Create a Brevo API key and verify the sender email address in Brevo.
2. In Firebase Console, create a service account key for the existing `myra-home-care` project. Store the entire JSON privately as the Render environment variable `FIREBASE_SERVICE_ACCOUNT_JSON`. Never commit this JSON to GitHub or send it in chat.
3. Set the other variables listed in `.env.example` in the hosting provider's environment settings.
4. Deploy this directory as the service root. Build command: `npm install`. Start command: `npm start`.
5. Set `ALLOWED_ORIGINS` to the exact website origin(s), comma-separated.
6. Test `/health` before connecting the website.

## Important security follow-up

The frontend must not open a staff, manager, or owner dashboard until the OTP verification endpoint succeeds and the Firebase session has refreshed its ID token. Firestore rules must require the privileged role claim and an unexpired `otpVerifiedUntil` claim for every privileged data collection. All role changes and privileged account provisioning must be performed by trusted server code, never by browser-side Firestore writes.

The current Firestore rules intentionally deny application collections other than a user's own profile. Do not loosen them just to make screens load. Do not use real patient information until the role-specific Firestore rules and backend authorization have been completed and tested.

A free host may sleep or impose usage limits. Check the provider's current free-tier conditions before production use.
