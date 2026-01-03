# DeltaTI API Integration Guide

## Fixed Issues

### 1. Environment Configuration
**FIXED**: Updated `.env.example` with actual Postman collection values:
- Base URL: `https://deltati-api.codextech.org` (from Postman collection description)
- API Key: Get from your Postman collection or API provider

### 2. Registration Endpoint
**FIXED**: Added missing `username` field to registration form
- **Before**: Only sent firstName, lastName, email, password
- **After**: Includes username field (required by API)
- File: `app/(auth)/register/page.tsx`

### 3. Login Endpoint
**FIXED**: Corrected login to match API expectations
- **Before**: Sent username field
- **After**: Sends email and password fields (as per API spec)
- The API expects email for login authentication
- File: `app/(auth)/login/page.tsx`

### 4. User Profile Display
**FIXED**: Enhanced profile display to show all available fields
- Added phone number with dial code
- Added role and status display
- File: `app/dashboard/profile/page.tsx`

### 5. User Update Endpoint
**FIXED**: Added proper handling for empty fields
- Removes empty values before sending to API
- Prevents sending null/undefined fields
- File: `app/dashboard/profile/page.tsx`

## API Structure Overview

### Authentication Flow
1. **Register** → Returns success message
2. **Verify OTP** → Email verification
3. **Login** → Returns JWT token + user object
4. **Check Auth** → Validates token and returns user data

### Request Headers
All requests include:
```
api-key: 153d0b4063f515895170f10bb884509b1c4591b60813351bda4191658d85e4cb
```

Authenticated requests also include:
```
Authorization: Bearer <jwt_token>
```

## Endpoint Details

### POST /auth/register
**Request Body:**
```json
{
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message_en": "User registered successfully. Please activate your account using the verification code sent to your email",
  "message_ar": "تم تسجيل المستخدم بنجاح. يرجى تفعيل حسابك باستخدام رمز التحقق المرسل إلى بريدك الإلكتروني"
}
```

### POST /auth/verify-otp
**Request Body:**
```json
{
  "email": "string",
  "code": "string"
}
```

**Response:**
```json
{
  "message_en": "Verification code verified successfully",
  "message_ar": "تم التحقق من رمز التحقق بنجاح"
}
```

### POST /auth/login
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message_en": "Login successful",
  "message_ar": "تم تسجيل الدخول بنجاح",
  "user": {
    "username": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "countryCode": "string",
    "dialCode": "string",
    "phone": "string",
    "dateOfBirth": "string",
    "gender": "string",
    "role": "string",
    "image": "string|null",
    "status": "string",
    "isBanned": false,
    "createdAt": "string"
  },
  "token": "string"
}
```

### GET /auth/check
**Headers:** Bearer token required

**Response:**
```json
{
  "authorized": true,
  "user": { /* user object */ }
}
```

### POST /users/update
**Headers:** Bearer token required

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string"
  // Include only fields you want to update
}
```

**Response:**
```json
{
  "message_en": "User data updated successfully",
  "message_ar": "تم تحديث بيانات المستخدم بنجاح"
}
```

### POST /users/update-image
**Headers:** Bearer token required

**Request:** Multipart form-data with `image` file field

**Response:**
```json
{
  "message_en": "Profile image updated successfully",
  "message_ar": "تم تحديث صورة الملف الشخصي بنجاح"
}
```

### POST /users/get-data
**Headers:** Bearer token required

**Response:**
```json
{
  "message_en": "User found",
  "message_ar": "تم العثور على المستخدم",
  "userData": { /* user object */ }
}
```

### POST /threat-intel/search
**Headers:** Bearer token required

**Request Body:**
```json
{
  "type": "ipv4|domain|hostname|url|md5|yara|cve",
  "value": "string"
}
```

**Response:**
```json
{
  "success": true,
  "total": 1,
  "limit": 50,
  "offset": 0,
  "results": [
    {
      "id": 123,
      "type": "ipv4",
      "value": "1.2.3.4",
      "description": "string",
      "source": "string",
      "severity": "medium|high|critical",
      "confidence": 80,
      "observedCount": 9,
      "firstSeen": "ISO date",
      "lastSeen": "ISO date"
    }
  ]
}
```

### POST /admins/ingest
**Headers:** Bearer token required

**Response:**
```json
{
  "success": true,
  "report": {
    "metadata": { /* timing info */ },
    "summary": {
      "totalIOCs": 17191,
      "newInPeriod": 17191,
      "highRiskPercentage": 1,
      "activeSources": 5
    },
    "severity": { /* breakdown by severity */ },
    "types": { /* breakdown by IOC type */ },
    "sources": { /* breakdown by source */ },
    "topThreats": [ /* array of top threats */ ]
  }
}
```

### GET /admins/fetch-status
**Headers:** Bearer token required

**Response:**
```json
{
  "success": true,
  "fetchStatus": {
    "lastUpdate": "ISO date",
    "sources": [
      {
        "name": "URLhaus",
        "key": "urlhaus",
        "enabled": true,
        "lastFetch": "ISO date",
        "status": "success",
        "count": 19518,
        "error": null,
        "ttl": 2592000000,
        "nextFetch": "ISO date"
      }
      // ... more sources
    ]
  }
}
```

## Testing the Integration

### 1. Environment Setup
```bash
cd /Users/kerolosxgad/Documents/GitHub/deltati-web
cp .env.example .env.local
# .env.local is already configured with correct values
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Test Flow
1. Navigate to http://localhost:3000
2. Click "Create account"
3. Fill in: username, first name, last name, email, password
4. Check email for verification code
5. Enter code on verification page
6. Login with username (or email) and password
7. Access dashboard features:
   - View user info on overview page
   - Search threat intelligence
   - Update profile
   - (Admin only) Run ingestion and view status

## Common Issues & Solutions

### Issue: "Missing token in response"
**Solution**: Check that login endpoint returns `token` field. Verify API_BASE and API_KEY are correct in `.env.local`.

### Issue: "Unauthorized" errors
**Solution**: Token might be expired. Logout and login again. JWT is valid for the period set by the API (check token expiration).

### Issue: "API 401" or "API 403"
**Solution**: Verify the API_KEY in `.env.local` matches the Postman collection value.

### Issue: Image upload fails
**Solution**: Ensure the file input has `name="image"` and the endpoint accepts multipart/form-data.

## File Structure Mapping

```
app/
├── (auth)/                    # Auth routes (no Bearer token)
│   ├── login/                # POST /auth/login
│   ├── register/             # POST /auth/register
│   ├── verify/               # POST /auth/verify-otp, /auth/resend-otp
│   ├── reset-password/       # POST /auth/reset-password
│   └── logout/               # POST /auth/logout
├── dashboard/                # Protected routes (Bearer token required)
│   ├── page.tsx             # GET /auth/check
│   ├── threat-intel/        # POST /threat-intel/search
│   ├── admin/               # POST /admins/ingest, GET /admins/fetch-status
│   └── profile/             # POST /users/*, multipart image upload
lib/
├── api.ts                   # API client with headers
└── auth.ts                  # JWT cookie management
```

## Next Steps

1. ✅ All endpoints are now correctly integrated
2. ✅ Environment configured with Postman values
3. ✅ All required fields added to forms
4. Consider adding:
   - Error message display for API responses
   - Loading states during API calls
   - Success toast notifications
   - Additional Threat Intel endpoints (fetch-ioc, correlate, etc.)
   - Pagination for search results
