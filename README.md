# TOTP Authenticator

Client-side TOTP (Time-Based One-Time Password) authenticator that allows users to securely generate and manage multi-factor authentication codes directly in the browser. Built with a React + TypeScript architecture and designed using backend-style service abstractions, it mirrors the core functionality of popular authenticator apps while remaining lightweight and privacy-focused.

---

## Overview

* Standards-Compliant MFA: Implements RFC 6238–compliant TOTP generation, producing time-based one-time passwords compatible with common MFA workflows.
* Secure Credential Handling: Enforces strict Base32 secret validation, normalization, and lifecycle management to ensure correctness and prevent invalid authentication states.
* Real-Time Token Synchronization: Maintains synchronized 30-second token rotation with visual countdown feedback to clearly communicate token validity windows.

---

## Technologies

### Frontend

* React (Vite): Responsive, component-based UI for managing authentication credentials and displaying rotating TOTP codes.
* State Management: Uses React hooks (`useState`, `useEffect`, `useRef`) to coordinate real-time token updates and UI state.
* Styling & UI: Built with Tailwind CSS and shadcn/ui to deliver a clean, accessible, and modern interface.

### Backend

* TOTP Engine: Uses the `otpauth` library to implement RFC 6238–compliant time-based OTP generation.
* Validation Layer: Handles Base32 decoding, secret normalization, UUID assignment, and error handling.
* Stores credential metadata in browser `localStorage` to maintain continuity across sessions without external dependencies.

---

## Setup & Installation

1. Clone the Repository:
```
git clone https://github.com/sethj34/totp-auth.git
cd totp-auth
```

2. Install Dependencies & Run:
```
npm install
npm run dev
```
