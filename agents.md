# Labour Connect Portal - Implementation Plan

## 1) Product Vision

Build a web portal that connects:

- [ ] Labour suppliers
- [ ] Agencies / employers with labour demand
- [ ] Internal executives who perform data entry
- [ ] Admin users who monitor data and manage users

The platform will start as an internal data-entry + management system, and then evolve into a searchable marketplace for matching labour supply and demand.

## 2) Core Roles and Access

### Admin

- [ ] View all records entered by all executives
- [ ] Create, edit, deactivate executive users from admin dashboard
- [ ] Create, edit, deactivate supplier and demand accounts from admin dashboard
- [ ] View supplier and demand accounts
- [ ] Configure marketplace settings (future phase)

### Executive

- [x] Login and access their own dashboard (Accomplished)
- [ ] Submit data entry forms with required fields:
  - [x] Skill (`skill`) (Accomplished)
  - [x] Team size (`teamSize`) (Accomplished)
  - [x] Wage rate in rupee (`wageRateInRupee`) (Accomplished)
  - [x] Rating as stars, top being 5 (`rating`, integer 1-5) (Accomplished)
  - [x] Remarks (`remarks`) (Accomplished)
- [ ] View and edit only their own submitted records (unless admin policy allows wider visibility)

### Supplier Account (External)

- [x] Register/login (Accomplished)
- [ ] Maintain profile and labour availability details
- [ ] Registration fields:
  - [x] Name of the agency (`agencyName`) (Accomplished)
  - [x] Mobile number (`mobileNumber`) (Accomplished)
  - [x] Landline number (`landlineNumber`) (Accomplished)
  - [x] Team size (`teamSize`) (Accomplished)
  - [x] Skill (`skill`) (Accomplished)
  - [x] Address (`address`) (Accomplished)
  - [x] State (`state`) (Accomplished)
- [ ] View relevant demand opportunities in marketplace (future phase)

### Demand Account (External)

- [ ] Register/login
- [ ] Post labour requirements
- [ ] Search / shortlist suppliers (future phase)

## 3) Tech Stack (Locked)

- [ ] Frontend + Backend: Next.js (App Router), JavaScript only (no TypeScript)
- [ ] UI: Tailwind CSS
- [ ] Database: MongoDB (Atlas recommended)
- [ ] Authentication: Firebase Authentication with email/password
- [ ] Optional session helper: Firebase Admin SDK + Next.js server routes/middleware

## 4) High-Level Architecture

### Frontend

- [ ] Separate dashboards per role
- [ ] Role-based navigation and route protection
- [ ] Minimalist GUI with light and dark themes

### Backend (Next.js API Routes / Route Handlers)

- [ ] REST-style API endpoints under `/api/*`
- [ ] Server-side role checks for all protected actions
- [ ] Centralized validation for form submissions

### Data Layer

- [ ] MongoDB collections for users, profiles, entries, marketplace listings, applications, and audits
- [ ] Indexed fields for search performance in marketplace phase

## 5) Authentication and Authorization

### Authentication

- [x] Firebase email/password sign-in for all roles (Accomplished)
- [x] Firebase Google OAuth sign-in for all non-admin roles with onboarding page (`/onboarding`) (Accomplished)
- [ ] Password reset and email verification enabled

### Authorization Model

- [ ] Store role in MongoDB user profile (`admin`, `executive`, `supplier`, `demand`)
- [ ] Verify Firebase identity token in server routes
- [ ] Enforce role-based authorization in middleware and backend handlers

## 6) Suggested MongoDB Collections

### `users`

- [ ] `firebaseUid`
- [ ] `email`
- [ ] `role` (`admin`, `executive`, `supplier`, `demand`)
- [ ] `status` (`active`, `inactive`)
- [ ] `createdAt`, `updatedAt`

### `executive_profiles`

- [ ] `userId`
- [ ] `name`
- [ ] `phone`
- [ ] `region`

### `supplier_profiles`

- [ ] `userId`
- [ ] `agencyName`
- [ ] `mobileNumber`
- [ ] `landlineNumber`
- [ ] `teamSize`
- [ ] `skill`
- [ ] `address`
- [ ] `state`
- [ ] `isMockData` (boolean, default `false`)
- [ ] `createdAt`, `updatedAt`

### `demand_profiles`

- [ ] `userId`
- [ ] `organizationName`
- [ ] `contactDetails`
- [ ] `defaultLocation`

### `entries`

(entered mainly by executives in initial phase)

- [ ] `entryType` (`supplier`, `demand`, `other`)
- [ ] `enteredBy` (executive userId)
- [ ] `payload.skill`
- [ ] `payload.teamSize`
- [ ] `payload.wageRateInRupee`
- [ ] `payload.rating` (integer 1-5)
- [ ] `payload.remarks`
- [ ] `status` (`draft`, `submitted`, `verified`)
- [ ] `isMockData` (boolean, default `false`)
- [ ] `createdAt`, `updatedAt`

### `marketplace_listings` (phase 2)

- [ ] `listingType` (`labour_supply`, `labour_demand`)
- [ ] `ownerUserId`
- [ ] `title`
- [ ] `location`
- [ ] `skills`
- [ ] `quantity`
- [ ] `startDate`
- [ ] `status` (`open`, `closed`)

### `applications` (phase 2)

- [ ] `listingId`
- [ ] `applicantUserId`
- [ ] `message`
- [ ] `status`
- [ ] `createdAt`

### `audit_logs`

- [ ] `actorUserId`
- [ ] `action`
- [ ] `entityType`
- [ ] `entityId`
- [ ] `meta`
- [ ] `createdAt`

## 7) Route / Page Blueprint

### Public

- [ ] `/` landing page
- [ ] `/login`
- [ ] `/register` (role-based onboarding)
- [ ] `/onboarding` (Google OAuth first-time role selection)

### Admin

- [ ] `/admin/dashboard`
- [ ] `/admin/users` (create/manage executives and other accounts)
- [ ] `/admin/entries` (all data entries)
- [ ] `/admin/mock-data` (seed and delete mock records)
- [ ] `/api/admin/mock-data/seed` (admin-only seed action)
- [ ] `/api/admin/mock-data/delete` (admin-only delete action for `isMockData=true`)

### Executive

- [ ] `/executive/dashboard`
- [ ] `/executive/entries/new`
- [ ] `/executive/entries`

### Supplier

- [ ] `/supplier/dashboard`
- [ ] `/supplier/profile`
- [ ] `/supplier/listings` (phase 2)

### Demand

- [ ] `/demand/dashboard`
- [ ] `/demand/profile`
- [ ] `/demand/listings` (phase 2)

### Marketplace (phase 2)

- [ ] `/marketplace`
- [ ] `/marketplace/listings/[id]`

## 8) Admin Dashboard Functional Scope

- [ ] KPI cards: total users, active executives, total entries, pending verification
- [ ] User management table with create/edit/activate/deactivate
- [ ] Entry monitoring with filters by executive/date/status
- [ ] Quick drill-down into individual entry history
- [ ] Mock-data controls:
  - [x] Seed 50-70 mock records for supplier profiles and executive entries (Accomplished)
  - [x] Delete all mock records (`isMockData = true`) from admin dashboard in one admin-only action (Accomplished)

## 9) Executive Dashboard Functional Scope

- [ ] Personal summary: records created, pending, approved
- [ ] Fast “New Entry” action
- [ ] Recent entries list with status
- [ ] Edit flow for draft/submitted entries based on policy
- [ ] Entry form validation:
  - [ ] `wageRateInRupee` must be numeric and positive
  - [ ] `rating` must be integer in range 1-5

## 10) Minimalist UI/UX Direction

Use `https://jarvislabs.ai/dashboard` only as directional inspiration for layout clarity.

### Style Principles

- [ ] Clean grid and generous spacing
- [ ] Minimal visual noise, strong content hierarchy
- [ ] Compact data tables with clear filters

### Theme

- [ ] Full light + dark mode support from day 1
- [ ] Tailwind `dark` class strategy
- [ ] Tokenized colors via CSS variables for consistent theming

### Component Set

- [ ] Sidebar + top bar shell
- [ ] Reusable cards, tables, forms, badges, modal dialogs
- [ ] Form validation states and loading skeletons

## 11) Delivery Phases

### Phase 1: Foundation + Internal Operations

- [ ] Project setup (Next.js + Tailwind + MongoDB + Firebase)
- [ ] Auth and role-based route guards
- [ ] Admin user creation for executives
- [ ] Executive data entry form (fixed required fields: skill, team size, wage rate in rupee, rating, remarks)
- [ ] Supplier registration form (fixed required fields: agency name, mobile number, landline number, team size, skill, address, state)
- [ ] Admin view for all submitted entries
- [ ] Add mock-data seed utility (50-70 rows) and admin delete action

### Phase 2: Account Expansion + Marketplace MVP

- [ ] Supplier and demand self-service accounts
- [ ] Listing creation for supply/demand
- [ ] Search and filter marketplace listings
- [ ] Basic expression of interest/application flow

### Phase 3: Operational Hardening

- [ ] Audit logs and activity history
- [ ] Notification system (email/in-app)
- [ ] Verification workflows and quality checks
- [ ] Reporting exports and analytics

## 12) Security and Compliance Baseline

- [ ] Server-side authorization for every protected endpoint
- [ ] Input validation and sanitization on all APIs
- [ ] Password policies and email verification
- [ ] Secure secret management using environment variables
- [ ] Basic rate limiting on auth and write-heavy endpoints
- [ ] Protect mock-data deletion with admin-only authorization and audit logs

## 13) Performance and Reliability Baseline

- [ ] Index frequently queried MongoDB fields
- [ ] Pagination for tables and marketplace search
- [ ] Debounced filtering for search-heavy views
- [ ] Error boundaries + graceful empty/error states

## 14) Testing Strategy

- [ ] Unit tests for validation and utility logic
- [ ] API tests for auth/authorization and role constraints
- [ ] E2E smoke tests for login and critical role flows
- [ ] Regression checklist before each release
- [ ] Form validation tests for:
  - [ ] Executive `rating` (1-5)
  - [ ] Executive `wageRateInRupee` positive numeric
  - [ ] Supplier `mobileNumber` and `landlineNumber` format rules

## 15) Pending Inputs Required From You

Before implementation, confirm:

- [ ] Approval workflow rules (who can edit what and when)
- [ ] Supplier/demand marketplace matching criteria
- [ ] Required reports and export formats

## 17) Mock Data Requirement (Confirmed)

- [x] Provide requested mock records for development/demo. (Accomplished: 50 suppliers + 50 demand + 2 executives + 60 executive entries)
- [ ] Mock records should exist for:
  - [x] Supplier profile registrations (Accomplished)
  - [x] Demand profile registrations (Accomplished)
  - [x] Executive profiles (2) (Accomplished)
  - [x] Executive entries (Accomplished: 30 per executive)
- [x] All mock records must include `isMockData: true` for safe cleanup. (Accomplished)
- [x] Admin must have an option in the dashboard to delete all mock records in one action. (Accomplished)

## 18) Mock Data Artifact

- [x] Seed file path: `mock-data/labour_portal_mock_data.json` (Accomplished)
- [ ] Contains:
  - [x] `50` supplier mock profiles (Accomplished)
  - [x] `50` demand mock profiles (Accomplished)
  - [x] `2` executive mock profiles (Accomplished)
  - [x] `60` executive mock entries (Accomplished: 30 each for 2 executives)
- [x] Credentials file path: `mock-data/mock_account_credentials.json` (Accomplished)
- [x] Admin delete action should remove only records where `isMockData = true`. (Accomplished)

## 16) Suggested Initial Build Order

1. Set up Next.js (JavaScript) + Tailwind + theme shell
2. Configure Firebase email auth
3. Add MongoDB connection + base user schema
4. Implement role guards and protected dashboards
5. Build admin user management (create executive)
6. Build executive entry form and list view
7. Build admin all-entries monitoring view
8. Add supplier/demand account dashboards
9. Launch marketplace MVP search + listing flow
