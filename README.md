# AgriCore — Smart Agriculture Management System (Extended Redux Version)

A farm management app for crops, harvest & orders, buyers, tasks, expenses, inventory and reports —
built as the **U Devs Internship Task (Batch 6)** extended version with **Redux Toolkit**, **React Router**
and **role-based authentication**.

**Author:** Hamna Yahya — Batch 6, U Devs

---

## Links

- **Live website:** https://hamnayahya416-sketch.github.io/agriculture-management-system/
- **GitHub repository:** https://github.com/hamnayahya416-sketch/agriculture-management-system

---

## Quick start

### Frontend only (demo mode — what the live site runs)

```bash
npm install
npm start          # dev server → http://localhost:3000
npm test           # jest tests (CI mode: CI=true npm test -- --watchAll=false)
npm run build      # production build
npm run deploy     # build + publish to GitHub Pages
```

### Full stack (frontend + PostgreSQL backend)

```bash
# 1. PostgreSQL must be running and you need its credentials
createdb agriculture_db            # or: psql -c 'CREATE DATABASE agriculture_db;'

# 2. Backend
cd backend
cp .env.example .env               # fill in DB_PASSWORD (+ JWT_SECRET)
npm install
npm run seed                       # tables + demo data + admin/manager users
npm run dev                        # API → http://localhost:5000/api/health

# 3. Frontend — in a second terminal, point it at the API
cd ..
REACT_APP_API_URL=http://localhost:5000/api npm start
```

Without `REACT_APP_API_URL` the app keeps using localStorage demo data, so the
GitHub Pages deployment is unaffected.

### Authentication (localStorage mode — what the live site runs)

Accounts live in localStorage under `agricore_users` with **SHA-256 hashed
passwords** (never plain text) and the active session in `agricore_session`.
On first load a default admin is seeded:

| Role | Email               | Password  | Permissions                                    |
| ---- | ------------------- | --------- | ---------------------------------------------- |
| Admin | `admin@agricore.com` | `Admin@123` | View, add, edit, delete everything + manage users |

* Sign in at `/login` with **email + password** (the login card shows a fill-in hint for the default admin).
* There is **no public signup** — only an admin can create accounts, at
  `/users` (*Register / Manage Users*, admin-only route + sidebar item).
* Both roles land on `/dashboard`; admins additionally see the
  *Administration* card and the *Register / Manage Users* menu entry.
* Role checks are case-insensitive via `useAuth()` (`isAdmin`), the
  `useRole()` hook and `selectCanModify` (admin → edit/delete, user → view/add).

### Seeded backend accounts (full-stack mode)

| Role    | Username  | Password     | Permissions                          |
| ------- | --------- | ------------ | ------------------------------------ |
| Admin   | `admin`   | `Admin@123`  | View, add, edit, delete everything   |
| Manager | `manager` | `Manager@123`| View + add only (no edit/delete)     |

Frontend authentication itself is handled by `src/app/auth/AuthContext.js`
(localStorage), so the GitHub Pages deployment never needs the backend.

---

## Tech stack

**Frontend:** React 19 · Redux Toolkit 2 · React Router 7 (HashRouter) · Recharts 3 ·
Create React App 5 · axios (Open-Meteo weather + backend API) · localStorage persistence · Jest tests

**Backend:** Node.js · Express · PostgreSQL · Sequelize ORM · JWT (jsonwebtoken) ·
bcryptjs · multer (buyer photo upload) · helmet · cors · morgan · express-rate-limit

---

## Design theme

Single theme matching the reference design: **dark-green page, lighter green cards,
white/light text** — driven by the tokens in `src/index.css` `:root`:

| Token | Value | Used for |
| ----- | ----- | -------- |
| `--primary` | `#0C3D27` | deep green: shell (sidebar/navbar), buttons, table headers, inset icon tiles |
| `--primary-hover` | `#14603A` | hover states — always *lighter*, never darker |
| `--text` | `#FFFFFF` | all font colors (always readable, as in the reference) |
| `--bg` | `#0F4D2F` | page background |
| `--surface` | `#176942` | cards, inputs, chips, panels |
| `--border` | `#1E7A50` | visible mid-green borders |
| `--muted` | `#C5DBD0` | secondary text — light and clearly visible |
| `--primary-text` / `--secondary` | `#22C55E` | bright accent: links, focus rings, icon hovers (reference check ✓) |

Rules enforced across `index.css`, `custom.css`, charts and seed avatars:

* No color darker than the reference deep green (`#0C3D27`) and no black text —
  fonts are white / light green-white exactly like the image.
* Status colors use white text on deep-green fills; errors are white text with a
  white accent border.
* Text on deep-green chrome (sidebar, navbar, table headers) is white.
* Charts use `src/app/assets/chartPalette.js` (bright green, deep green, white + alphas).
* Dark-green scrollbars, bright-green focus rings, green checkbox/radio accents.
* Print styles flip to white background + black text for paper.
* No blue/orange/red/violet accents anywhere.

---

## Project structure

```
backend/                 Express + Sequelize API
├── app.js               express app: cors/helmet/morgan/static + 12 route mounts
├── config/db.js         Sequelize instance (postgres) + authenticate/connect
├── seed.js              sync + seed admin/manager users and sample farm data
├── models/              13 models (crop, order, buyer, task, expense, inventory,
│                        inventoryUsage, worker, attendance, equipment,
│                        maintenance, activity, user) + associations
├── controllers/         thin controllers (user, buyer, inventory, activity are custom)
├── utils/crudFactory    shared CRUD + activity logging + React/PDF field aliases
├── middleware/          authMiddleware (protect/authorize), uploadMiddleware (multer),
│                        errorMiddleware
├── routes/              12 routers
└── public/Images/       uploaded buyer photos (git-ignored)

src/
├ index.js                 Provider + HashRouter bootstrap, dispatches GET* rehydration
├ index.css                dark-green/black/white token palette (--primary … --border)
├ App.jsx                  routes + AuthProvider
├ fake-db/seedData.js      demo seeds (crops, orders, buyers, tasks, expenses, inventory, activity)
└ app/
    ├── components/          crops · harvest · buyers · tasks · expenses · inventory · workers ·
    │                        equipment · maintenance · users (RegisterUserForm, UserTable) ·
    │                        dashboard · reports · common
    ├── views/               page components (Login, Dashboard, Crops, … Users, Reports, NotFound)
    ├── auth/                AuthContext (login/logout/registerUser/removeUser + session seed),
    │                        authStorage (agricore_users / agricore_session), passwords (SHA-256),
    │                        LoginForm, ProtectedRoute, AdminRoute
    ├── hooks/               useWeather, useRole
    ├── utils/               validators, formatters, id, exportCsv
    ├── assets/              chartPalette.js (chart colors) · styles/custom.css (print, bootstrap overrides)
    └── redux/               actions · api · reducers · selectors · middleware · store
```

---

## Modules & routes

| Route             | Page          | What it does                                                        |
| ----------------- | ------------- | ------------------------------------------------------------------- |
| `/login`          | Login         | Email + password sign-in, default-admin fill hint, protected redirects |
| `/dashboard`      | Dashboard     | KPI stats, crop health, cutting schedule, alerts, weather, activity (+ admin-only Administration card) |
| `/crops`          | Crops         | Full crop CRUD, health filter, sorting, stock (harvest − sold)      |
| `/harvest-orders` | HarvestOrders | Harvest/orders summaries, order CRUD, stock progress, charts        |
| `/buyers`         | Buyers        | Buyer CRUD with CNIC validation, photo upload (multipart/Base64), zoomable details |
| `/tasks`          | Tasks         | Task board with computed Overdue status, done toggle, filters       |
| `/expenses`       | Expenses      | Expense CRUD, category filter, CSV export, spending pie chart       |
| `/inventory`      | Inventory     | Input CRUD, usage logging (auto-decrements stock), low-stock alerts |
| `/workers`        | Workers       | Crew CRUD, daily wages, present-today stats                         |
| `/attendance`     | Attendance    | Per-worker daily attendance (one record per day)                    |
| `/equipment`      | Equipment     | Machine CRUD, service interval, status                              |
| `/maintenance`    | Maintenance   | Service log per machine with technician and cost                    |
| `/users`          | Users         | **Admin only** — register new accounts (email, role) + manage/delete users |
| `/reports`        | Reports       | Monthly report, profit & loss chart, CSV export, print/PDF, activity log |
| `*`               | NotFound      | 404 page                                                            |

---

## Redux tree

Every module follows the mandated flow: **component → thunk → `*_REQUEST` → api → `*_SUCCESS`/`*_FAILURE` → reducer**.

```
src/app/redux/
├── utilities.js            REQUEST/SUCCESS/FAILURE helpers + every action-type constant
│                           (CROP_REQUEST, ORDER_REQUEST, USER_REQUEST, WEATHER_REQUEST, UI, ALERT …)
├── store/index.js          configureStore (serializableCheck off, devTools outside production)
├── api/                    promise-based adapter → { data: { succeeded, message, data } }
│   ├── http.js             axios client for the backend (Bearer JWT, auto sign-out on 401,
│   │                       enabled only when REACT_APP_API_URL is set)
│   ├── index.js            KEYS, ok/bad, readList/writeList/readValue/writeValue/uid (localStorage demo mode)
│   ├── crops|orders|buyers|tasks|expenses|inventory/
│   ├── workers|attendance|equipment|maintenance/
│   ├── activity/           get/log/clear (max 300 entries)
│   └── weather/            axios → Open-Meteo forecast (5-day), normalised payload
├── actions/                thunks named GETCROPS/ADDCROP/UPDATECROP/REMOVECROP, SAVEBUYER,
│                           ADDUSAGE, FETCHWEATHER … all (data, moveToNext, failure)
│                           └── ui/index.js plain creators: showToast, toggleSidebar, dismissAlert …
├── reducers/
│   ├── factory.js          createCrudReducer — 12 CRUD flags (get/add/update/remove × request/success/failure)
│   ├── crops|orders|buyers|tasks|expenses|workers|attendance|equipment|maintenance/
│   ├── inventory/          items + usageHistory (usage decrements stock in the api)
│   ├── user/               { user:{fullName,email,role}, users[] } — mirror of the AuthContext
│   │                       session (AuthContext owns auth persistence)
│   ├── weather/            { status, data, error, lastUpdated }
│   ├── activity/           { logs[] }   alerts/ { dismissed[] }   ui/ { toast, sidebar }
│   └── index.js            combineReducers — 15 slices
├── selectors/              components read state only through selectors
│   ├── entitySelectors.js  selectCropItems, selectWorkerItems, selectCurrentRole, selectCanModify …
│   ├── cropSelectors.js    stock rows, available stock, options, health counts, filters
│   ├── buyerSelectors|taskSelectors|summarySelectors|reportSelectors|weatherSelectors
│   └── selectAlerts|selectLowStock|selectDueCrops|selectProfitByCrop
└── middleware/
    ├── persistMiddleware.js  only *_success actions → write the changed namespace to localStorage (demo mode)
    └── activityLogger.js     *_success add/edit/delete/login → LOGACTIVITY thunk → activity log
                              (no-op for CRUD in backend mode — the server writes the audit trail)
```

## Data flow

```
component
   │  dispatch(ADDCROP(data, moveToNext, failure))
   ▼
thunk (actions/crops)
   │  dispatch(CROP_REQUEST.ADD_CROP_REQUEST)
   │  api.save(data)  →  { data: { succeeded, message, data } }
   ▼
SUCCESS / FAILURE
   │  moveToNext(data) | failure(message)   → component shows the right toast
   ▼
reducer (factory flags + list update, type "crops/add_success")
   │  activityLogger  → appends an activity entry
   │  persistMiddleware → writes the namespace to localStorage (agri_*)
   ▼
selector (memoized — available stock, overdue, summaries, chart series …)
   ▼
component re-renders
```

* Components never read `state.x` directly — always through selectors.
* Derived data (stock = harvestQty − sold, overdue = dueDate < today, summaries)
  is computed only in selectors, never stored.
* Rehydration on app start: the `AuthProvider` restores `agricore_session`, and
  `GETCROPS/GETORDERS/…/GETACTIVITY` are dispatched from `src/index.js`
  (localStorage + demo seeds in demo mode, or the API when `REACT_APP_API_URL` is set).

### localStorage keys

Data (Redux demo mode): `agri_crops`, `agri_orders`, `agri_buyers`, `agri_tasks`,
`agri_expenses`, `agri_inventory` ({items, usageHistory}), `agri_workers`,
`agri_attendance`, `agri_equipment`, `agri_maintenance`, `agri_activity`,
`agri_alerts`, `agri_ui` (sidebar)

Auth (AuthContext): `agricore_users` (accounts with SHA-256 password hashes,
seeded default admin), `agricore_session` (current user)

## Backend (PostgreSQL + Express)

The Redux api layer (`src/app/redux/api/*`) picks its transport at runtime:

- **`REACT_APP_API_URL` set** → every call goes to the Express API through
  `src/app/redux/api/http.js` (axios, `Authorization: Bearer <jwt>`, 401 → auto sign-out).
- **Not set** → the original localStorage adapter keeps working (GitHub Pages demo).

> **Note:** sign-in, sign-out, registration and user management run entirely in
> the frontend through `AuthContext` (`agricore_users` / `agricore_session`),
> so the auth endpoints below are not used by the app itself — they remain part
> of the standalone API.

Every endpoint answers with the same contract the thunks already expect:

```json
{ "succeeded": true, "message": "Crop created.", "data": { } }
```

### API overview (all under `/api`)

| Method + path              | Auth            | Purpose                                    |
| -------------------------- | --------------- | ------------------------------------------ |
| `GET /health`              | public          | liveness check                             |
| `POST /users/register`     | public          | self-registration (always Manager)         |
| `POST /users/login`        | public          | → `{ user…, token }`                       |
| `POST /users/logout`       | JWT             | sign out (client also clears the token)    |
| `GET /users/me`            | JWT             | restore the session on app start           |
| `GET/POST /users`          | admin, manager  | list / create accounts                     |
| `PUT/DELETE /users/:id`    | admin           | update (username, fullName, email, role, optional password) / delete (not yourself) |
| `GET/POST/PUT/DELETE /crops`        | admin, manager (PUT/DELETE: admin) | crop CRUD (`target` = `expectedQty`) |
| `… /orders`               | same            | order CRUD (`total` auto-calculated)       |
| `… /buyers`               | same            | buyer CRUD **+ photo** (multipart, ≤ 1 MB jpg/png → `public/Images`, CNIC unique, stock-checked) |
| `… /tasks`, `/expenses`, `/workers`, `/attendance`, `/equipment`, `/maintenance` | same | CRUD with validation + field aliases |
| `GET/POST/PUT/DELETE /inventory`, `POST /inventory/usage` | same | always returns `{ items, usageHistory }`; usage decrements stock in a transaction |
| `GET /activity`, `DELETE /activity` | GET: admin, manager (own entries) / DELETE: admin | audit trail written by the server on every add/edit/delete |

**Field aliases:** the database uses the PDF names (`fullName`, `role`, `dailyWage`,
`joinDate`, `expectedQty`, `performedBy`) while the existing React screens use
`name`, `job`, `wage`, `joinedDate`, `target`, `technician` — the API accepts and
returns **both**, so no UI code was rewritten.

### backend/.env

See `backend/.env.example` — `PORT`, `CORS_ORIGIN`, `DB_NAME/USER/PASSWORD/HOST/PORT`,
`JWT_SECRET`, `JWT_EXPIRES_IN`, `DB_SYNC`. The real `.env` is git-ignored; never commit it.

```bash
cd backend
node testConnection.js    # verify database credentials without starting the server
npm run seed              # create tables + demo data (idempotent)
npm start                 # production start
npm run dev               # nodemon
```

## Weather

Open-Meteo forecast for *Green Valley Farms, Punjab* (lat 31.5204, lon 74.3587) fetched with **axios**,
auto-refreshed every 10 minutes via the `useWeather` hook + `FETCHWEATHER` thunk.

## Validation

Every form validates inline with `src/app/utils/validators.js` (required, CNIC = 13 digits with
live dash formatting, quantity ≤ available stock, dates, amounts, image JPG/PNG ≤ 1 MB)
plus success/error toasts via `showToast`.

## Tests

`src/App.test.js` — renders the login page and blocks protected pages for unauthenticated users.

```bash
CI=true npm test -- --watchAll=false
```

Backend checks (no test framework — plain scripts):

```bash
cd backend
node testConnection.js    # DB credentials + connectivity
npm run seed              # schema + demo data
npm start & curl http://localhost:5000/api/health
```

## Links

- **Live website:** https://hamnayahya416-sketch.github.io/agriculture-management-system/
- **GitHub repository:** https://github.com/hamnayahya416-sketch/agriculture-management-system
