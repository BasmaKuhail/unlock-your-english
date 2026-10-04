# Unlock Your English — UYE

A production-focused English learning platform built for **Unlock Your English (UYE)**, a free educational initiative that helps learners develop their English through structured levels, lessons, activities, and guided progression.

The platform provides separate experiences for learners and administrators, with Firebase powering authentication and persistent application data.

## Tech Stack

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Firebase Authentication**
- **Cloud Firestore**
- **Firebase Admin SDK**
- **Vercel**

## Core Features

### Learner Experience

Learners access the platform using accounts created and managed by UYE administrators.

The learner system includes:

- Secure learner authentication
- Persistent learner sessions
- Level-based access
- Controlled progression between levels
- Account status management
- Learning material organised by level
- Responsive learner interface

Learner accounts use generated credentials rather than public self-registration.

### Admin Dashboard

The administration area provides a dedicated interface for managing the UYE platform.

Current functionality includes:

- Secure administrator authentication
- Protected admin routes
- Student management
- Student search and filtering
- Active/frozen account states
- Level access control
- Student profile editing
- Admin profile management
- Admin credential updates
- Dashboard statistics
- Responsive administration UI

Additional content and level-management functionality is being integrated with Firestore.

## Authentication Architecture

UYE intentionally separates learner authentication from administrator authorization.

### Admin Authentication

Administrator login uses Firebase Authentication on the client and Firebase Admin on the Next.js server.

```text
Admin enters credentials
        ↓
Firebase Authentication
        ↓
Firebase ID token
        ↓
POST /api/auth/admin-session
        ↓
Next.js server
        ↓
Firebase Admin verifies token
        ↓
Verify admin custom claim
        ↓
Create secure HttpOnly session cookie
        ↓
Protected admin routes
```

An account must contain the Firebase custom claim:

```text
admin: true
```

before an administrator session can be created.

The resulting session cookie is:

- `HttpOnly`
- `Secure` in production
- `SameSite=Lax`
- unavailable to client-side JavaScript

This prevents access to the admin dashboard based solely on client-side authentication state.

### Learner Authentication

Learners authenticate separately through Firebase Authentication.

Learner sessions are persisted for a controlled period and automatically expire according to the application's learner-session policy.

Admin authentication is handled independently through the server-side session cookie.

## Security

The project follows several important security boundaries:

- Firebase Admin runs only on the server.
- Service-account credentials are never exposed to browser code.
- Admin authorization is verified server-side.
- Admin status is not trusted from client state.
- Admin sessions use HttpOnly cookies.
- Firebase custom claims determine administrator privileges.
- Protected admin endpoints validate the administrator session.
- Learner and administrator authentication flows remain separate.
- Sensitive credentials are stored using environment variables.
- Production credentials are excluded from Git.

## Project Structure

The application broadly follows this structure:

```text
app/
├── admin/
├── api/
│   ├── admin/
│   └── auth/
└── ...

components/
├── admin/
├── admin-auth/
└── ...

context/
└── admin-context.tsx

hooks/
├── use-admin-dashboard.ts
└── use-admin-login-form.ts

layouts/
└── dashboard-layout.tsx

lib/
├── admin/
├── auth/
└── firebase/
    ├── admin.ts
    └── client.ts
```

Server-only Firebase Admin functionality lives under:

```text
lib/firebase/admin.ts
```

while browser-side Firebase functionality is kept separately in:

```text
lib/firebase/client.ts
```

This separation is intentional and should be preserved.

## Production Checks

Before a production release:

```bash
npm run build
```

The project should also be validated with automated tests covering important authentication, authorization, Firestore security, and learner/admin workflows.

Planned production testing includes automated Firebase Security Rules tests before the platform is considered production-ready.

## Roadmap

Current development is focused on:

- Firestore-backed level management
- Learning content management
- Lesson organisation
- Student progression
- Admin content controls
- Learner dashboard integration
- Automated testing
- Firebase Security Rules testing
- Production hardening

## About UYE

**Unlock Your English (UYE)** is a free educational initiative designed to make structured English learning accessible through guided lessons, vocabulary, activities, quizzes, and level-based progression.

The web platform extends the initiative by providing learners with a central place to access their learning journey while giving administrators the tools needed to manage students and educational content.
