# DeltaTI Dashboard (Next.js)

Dashboard UI to interact with the DeltaTI API collection (Auth, Users, Admins, and Threat Intel).

## Setup

1. Copy environment template and fill values:

```bash
cp .env.example .env.local
```

The `.env.example` comes pre-configured with values from the Postman collection:
- `API_BASE=https://deltati-api.codextech.org` (from Postman collection description)
- `API_KEY=your_api_key_here` (get from your Postman collection or API dashboard)

You can use these defaults or modify them for your environment.

2. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Auth & Protection

- Login stores JWT in an httpOnly cookie `jwt`.
- `middleware.ts` protects `/dashboard/*` routes.
- Logout clears cookie and calls remote `/auth/logout` best-effort.

## Endpoints Mapping

All endpoints match the Postman collection structure. The API uses:
- **Base URL**: `https://deltati-api.codextech.org` (from Postman collection description)
- **Auth Header**: `api-key: <API_KEY>` (sent with all requests)
- **Bearer Token**: `Authorization: Bearer <token>` (for authenticated routes)

### Auth Endpoints (No Bearer token required)
- `POST /auth/register` - Register new user (requires: username, firstName, lastName, email, password)
- `POST /auth/verify-otp` - Verify email with OTP code (requires: email, code)
- `POST /auth/resend-otp` - Resend OTP code (requires: email)
- `POST /auth/reset-password` - Reset password with OTP (requires: email, code, password)
- `POST /auth/login` - Login with email (requires: email, password)
- `POST /auth/logout` - Logout and revoke token (Bearer token required)
- `GET /auth/check` - Check auth status and get user data (Bearer token required)

### Users Endpoints (Bearer token required)
- `POST /users/update` - Update user profile (accepts: firstName, lastName, phone, etc.)
- `POST /users/update-image` - Upload profile image (multipart: image file)
- `POST /users/delete` - Delete user account
- `POST /users/get-data` - Get user profile data

### Admin Endpoints (Bearer token required)
- `POST /admins/ingest` - Trigger threat intelligence data ingestion
- `GET /admins/fetch-status` - Get status of all threat feed sources

### Threat Intel Endpoints (Bearer token required)
- `POST /threat-intel/search` - Search IOCs by type and value
- `POST /threat-intel/fetch-ioc` - Fetch specific IOC by ID
- `POST /threat-intel/correlate` - Correlate IOCs
- Additional endpoints available in Postman collection

## Implementation Notes

- All API calls go through [lib/api.ts](lib/api.ts):
  - Automatically adds `api-key` header from environment
  - Automatically adds `Bearer` token from httpOnly cookie
  - Supports JSON and multipart/form-data requests
- Authentication:
  - JWT stored in secure httpOnly cookie named `jwt`
  - Cookie set with 7-day expiration
  - Middleware protects `/dashboard/*` routes
- File uploads use `apiFetchForm()` for multipart requests
- Error responses include `message_en` and `message_ar` fields when available

## Files Reference

### Configuration
- [package.json](package.json) - Dependencies and scripts
- [tsconfig.json](tsconfig.json) - TypeScript configuration
- [tailwind.config.ts](tailwind.config.ts) - Tailwind CSS config
- [.env.example](.env.example) - Environment template with Postman values

### Core Library
- [lib/api.ts](lib/api.ts) - API fetch wrapper with auth headers
- [lib/auth.ts](lib/auth.ts) - JWT cookie management
- [middleware.ts](middleware.ts) - Route protection middleware

### Auth Pages
- [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx) - Login (username or email)
- [app/(auth)/register/page.tsx](app/(auth)/register/page.tsx) - Registration with username
- [app/(auth)/verify/page.tsx](app/(auth)/verify/page.tsx) - OTP verification
- [app/(auth)/reset-password/page.tsx](app/(auth)/reset-password/page.tsx) - Password reset

### Dashboard Pages
- [app/dashboard/page.tsx](app/dashboard/page.tsx) - Overview with user info
- [app/dashboard/threat-intel/page.tsx](app/dashboard/threat-intel/page.tsx) - IOC search
- [app/dashboard/admin/page.tsx](app/dashboard/admin/page.tsx) - Admin controls
- [app/dashboard/profile/page.tsx](app/dashboard/profile/page.tsx) - Profile management

### UI Components
- [components/ui/Button.tsx](components/ui/Button.tsx)
- [components/ui/Input.tsx](components/ui/Input.tsx)
- [components/ui/Alert.tsx](components/ui/Alert.tsx)
- [components/ui/Table.tsx](components/ui/Table.tsx)
- [components/ui/Tabs.tsx](components/ui/Tabs.tsx)