# Labour Connect Portal

Next.js (App Router) portal for admin, executive, supplier, and demand roles using Tailwind, MongoDB, and Firebase email/password auth.

## Implemented Scope

- Role-based dashboards: admin, executive, supplier, demand
- Executive entry form fields:
  - `skill`
  - `teamSize`
  - `wageRateInRupee`
  - `rating` (1-5)
  - `remarks`
- Supplier registration/profile fields:
  - `agencyName`
  - `mobileNumber`
  - `landlineNumber`
  - `teamSize`
  - `skill`
  - `address`
  - `state`
- Admin mock-data operations:
  - seed from `mock-data/labour_portal_mock_data.json`
  - delete all documents where `isMockData=true`
- Mock data artifact includes:
  - 50 supplier accounts + supplier profiles
  - 50 demand accounts + demand profiles
  - 2 executive accounts + executive profiles
  - 60 executive entries (30 per executive)
  - Credentials file: `mock-data/mock_account_credentials.json`

## Setup

1. Copy `.env.example` to `.env.local` and fill Firebase + MongoDB credentials.
2. In Firebase Console:
   - Enable `Google` provider under `Authentication > Sign-in method`.
   - Add your local/dev domain to `Authentication > Settings > Authorized domains` (for example `localhost`).
3. Install packages:

```bash
npm install
```

4. Run the app:

```bash
npm run dev
```

## Mock Data + Credentials

- Use admin dashboard `Mock Data` page to seed/delete mock data.
- Seeded data includes:
  - 50 supplier users + supplier profiles
  - 50 demand users + demand profiles
  - 2 executive users + executive profiles
  - 60 executive entries (30 per executive)
- Credentials artifact:
  - `mock-data/mock_account_credentials.json`
  - Default password: `WorkBridge@123`
  - Includes 1 mock admin account: `admin.mock@workbridge.dev`

If you want these credentials to work with Firebase login, create/update Firebase Auth users:

```bash
node scripts/create-firebase-mock-users.js
```

Note: these scripts load variables from `.env` and `.env.local`.

Seed Mongo mock records directly (without dashboard login):

```bash
npm run mock:seed:db
```

Delete mock data in one go:

```bash
npm run mock:delete:all
```

Or run cleanup separately:

```bash
npm run mock:delete:db
npm run mock:delete:firebase
```

## Key Routes

- Public: `/`, `/login`, `/register`
- Admin: `/admin/dashboard`, `/admin/users`, `/admin/entries`, `/admin/mock-data`
- Executive: `/executive/dashboard`, `/executive/entries/new`, `/executive/entries`
- Supplier: `/supplier/dashboard`, `/supplier/profile`
- Demand: `/demand/dashboard`, `/demand/profile`

## APIs

- `POST /api/users/bootstrap`
- `POST /api/auth/session`, `DELETE /api/auth/session`
- `GET/POST/PATCH /api/entries`
- `GET/POST/PATCH /api/users/manage` (admin)
- `GET /api/admin/kpis` (admin)
- `POST /api/admin/mock-data/seed` (admin)
- `POST /api/admin/mock-data/delete` (admin)
- `GET/PATCH /api/supplier/profile`
- `GET/PATCH /api/demand/profile`
