# ServiceHub — Services Marketplace

A three-sided marketplace: customers book services, vendors sell and fulfil them, admins govern the whole thing. Built as a take-home assignment (services marketplace brief).

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (access + refresh tokens), bcrypt |
| Payments | Mocked — no real gateway integrated |

## Live links

- Frontend: _add deployed URL_
- API: _add deployed URL_

## Getting started

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in your own values
npm run dev

# Frontend
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev
```

### Environment variables

**Backend `.env`**
```
MONGO_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
PORT=5000
```

**Frontend `.env`**
```
VITE_API_URL=http://localhost:5000/api
```

### Seeding an admin account

```bash
cd backend
node scripts/createAdmin.js
```
Creates `admin@gmail.com` / `Admin@123` (change these before deploying anywhere real).

## Roles

| Role | Can do |
|---|---|
| **Customer** | Sign up, browse published services, view slots, book, pay (mocked), reschedule, cancel, view own bookings |
| **Vendor** | Sign up (goes into `PENDING` until approved), manage own services and offerings, set weekly availability and date exceptions, confirm/reject/complete bookings, mark no-shows |
| **Admin** | Approve/reject vendor applications, manage the vendor list |

A pending or rejected vendor can sign in and see their status, but nothing else — enforced server-side, not just hidden in the UI.

## Project structure

```
backend/
  models/        User, Service, BookingSlot, Booking, Category
  controllers/   auth, vendor (services/availability/bookings/profile), customer bookings, admin, categories
  middleware/    auth.middleware (verifyToken), requireVendor, requireRole
  routes/
  utils/         slotGenerator.js — derives bookable slots from weekly rules + exceptions
  scripts/       createAdmin.js, concurrencyTest.js

frontend/
  src/
    pages/
      customer/  Services, ServiceDetail, MyBookings
      vendor/    Dashboard, Services, ServiceForm, Availability, Bookings, Profile
      admin/     Vendors
    vendor/pages/VendorLayout.jsx   — sidebar shell for the vendor section
    api/axios.js
```

## Core design decisions

- **Slots are derived, never hand-entered.** A vendor sets weekly rules (`weekday`, open windows, capacity) and one-off date exceptions. Bookable slots for a given offering and date range are computed on read from those rules — see `utils/slotGenerator.js`. A `BookingSlot` document is only materialized in the database the moment someone actually tries to book that time.
- **Capacity is enforced atomically at the database level.** A booking request first tries to `create()` the slot document (covers the very first booking of a given time); if that loses a race (duplicate key on `{offeringId, startAt}`), it falls back to an atomic `findOneAndUpdate` that only increments `bookedCount` if it's still below `capacity`. Two concurrent requests for the last seat can never both succeed — see `controllers/customerBookingController.js`.
- **Booking lifecycle** is a strict state machine (`PENDING → CONFIRMED → COMPLETED/CANCELLED/NO_SHOW`, or `PENDING → REJECTED/CANCELLED`), with every transition writing to an embedded history array on the booking so the detail view can show a timeline. Illegal transitions (e.g. completing a `PENDING` booking) return `422`.
- **Vendor status is re-checked server-side on every request**, not trusted from the JWT — an admin approving or rejecting a vendor takes effect on the vendor's very next request, without requiring logout/login.

## What's not built yet

Being upfront about gaps rather than leaving them silent:

- **M7 — Payments (mocked).** Bookings currently land in `PENDING` regardless of `paymentMode`; no mock payment record, no idempotency key, no webhook simulation yet.
- **M2 — Fine-grained RBAC.** Authorization currently uses a simple `role` field (`CUSTOMER` / `VENDOR` / `ADMIN`) rather than a data-driven permission-slug system with custom admin roles. Sufficient for this submission's scope, but not what the brief's stretch-tier permission model describes.
- **M8 — Admin console.** Only vendor approval/rejection is built. No dashboard counts, cross-vendor booking list, force-cancel, or role management screens yet.
- **Reschedule** (moving a booking to a different slot with atomic capacity release/claim) is not implemented.
- **Forgot-password flow** (stretch) is not implemented.

## Testing

`backend/scripts/concurrencyTest.js` fires 20 simultaneous booking requests at a single slot to verify capacity is never exceeded. Run with:

```bash
API_URL=<your-api-url> TEST_CUSTOMER_TOKEN=<a-valid-customer-access-token> \
  node scripts/concurrencyTest.js <slotId> <offeringId>
```
