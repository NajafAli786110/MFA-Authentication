# Two-Factor Authentication (2FA) System

A secure 2FA (Two-Factor Authentication) implementation using Node.js, Passport.js, Speakeasy, and QRCode for enhanced user security.

## Features
- **MFA Activation**: Generate and store a unique secret for each user.
- **QR Code Generation**: Generate QR codes for easy setup in authenticator apps like Google Authenticator.
- **OTP Verification**: Verify user-entered OTPs with server-side validation.
- **JWT Integration**: Generate JWT tokens after successful 2FA verification for secure user sessions.

## Technologies Used
- **Node.js**: Backend runtime environment.
- **Passport.js**: Middleware for user authentication.
- **Speakeasy**: Library for generating and verifying time-based OTPs.
- **QRCode**: Library for generating QR codes for user setup.
- **JWT**: Secure session management.

## How It Works
1. **Setup 2FA**
   - Generates a unique secret key using Speakeasy.
   - Creates a QR code for users to scan with an authenticator app.
   - Saves the secret in the database.

2. **Verify 2FA**
   - Validates the OTP entered by the user using Speakeasy's TOTP verification.
   - If verified, generates a JWT token for the session.
