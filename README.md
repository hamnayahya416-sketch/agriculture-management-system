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

```bash
npm install
npm start          # dev server → http://localhost:3000
npm test           # jest tests (CI mode: CI=true npm test -- --watchAll=false)
npm run build      # production build
npm run deploy     # build + publish to GitHub Pages
```

### Demo credentials

| Role    | Username  | Password    | Permissions                          |
| ------- | --------- | ----------- | ------------------------------------ |
| Admin   | `admin`   | `admin123`  | View, add, edit, delete everything   |
| Manager | `manager` | `manager123`| View + add only (no edit/delete)     |

Role gating: `useRole()` hook + `selectCanModify` selector (Admin can edit/delete, Manager can view/add).

---

## Tech stack

React 19 · Redux Toolkit 2 · React Router 7 (HashRouter) · Recharts 3 · Create React App 5 ·
axios (Open-Meteo weather) · localStorage persistence · Jest tests

---

## Design theme

Green palette driven by `--agri-*` tokens in `src/index.css`:

| Token | Value | Used for |
| ----- | ----- | -------- |
| `--agri-bg` | `#008631` | page background |
| `--agri-accent` | `#00ab41` | buttons, sidebar/navbar, active states |
| `--agri-accent-dark` | `#008f37` | hover / borders |
| `--agri-accent-light` | `#d9f6e6` | cards, tables, forms |
| `--agri-tint` | `#b9ecd0` | insets, table headers, hover rows |

Text colors stay black/dark (`--primary-text`), status colors (red/amber/violet) remain distinguishable.
Dark mode overrides live in `src/app/assets/styles/custom.css`.

---

## Project structure

```
src/
├── index.js                 Provider + HashRouter bootstrap, dispatches GET* rehydration
├── index.css                green --agri-* token palette
├── App.jsx                  routes
├── fake-db/seedData.js      demo seeds (crops, orders, buyers, tasks, expenses, inventory, activity)
└── app/
    ├── components/          crops · harvest · buyers · tasks · expenses · inventory · dashboard · reports · common
    ├── views/               page components (Login, Dashboard, Crops, …)
    ├── auth/                LoginForm, ProtectedRoute
    ├── hooks/               useWeather, useRole
    ├── utils/               validators, formatters, id, exportCsv
    ├── assets/styles/       custom.css (dark mode, print, bootstrap overrides)
    └── redux/               actions · api · reducers · selectors · middleware · store
```

---

## Modules & routes

| Route             | Page          | What it does                                                        |
| ----------------- | ------------- | ------------------------------------------------------------------- |
| `/login`          | Login         | Role login, demo credential chips, protected redirects              |
| `/dashboard`      | Dashboard     | KPI stats, crop health, cutting schedule, alerts, weather, activity |
| `/crops`          | Crops         | Full crop CRUD, health filter, sorting, stock (harvest − sold)      |
| `/harvest-orders` | HarvestOrders | Harvest/orders summaries, order CRUD, stock progress, charts        |
| `/buyers`         | Buyers        | Buyer CRUD with CNIC validation, photo upload (Base64), zoomable details |
| `/tasks`          | Tasks         | Task board with computed Overdue status, done toggle, filters       |
| `/expenses`       | Expenses      | Expense CRUD, category filter, CSV export, spending pie chart       |
| `/inventory`      | Inventory     | Input CRUD, usage logging (auto-decrements stock), low-stock alerts |
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
├── api/                    promise-based localStorage adapter → { data: { succeeded, message, data } }
│   ├── index.js            KEYS, ok/bad, readList/writeList/readValue/writeValue/uid
│   ├── crops|orders|buyers|tasks|expenses|inventory/
│   ├── workers|attendance|equipment|maintenance/
│   ├── users/              login/logout/session + user CRUD (built-in admin/manager accounts)
│   ├── activity/           get/log/clear (max 300 entries)
│   └── weather/            axios → Open-Meteo forecast (5-day), normalised payload
├── actions/                thunks named GETCROPS/ADDCROP/UPDATECROP/REMOVECROP, SAVEBUYER,
│                           ADDUSAGE, LOGIN/LOGOUT, FETCHWEATHER … all (data, moveToNext, failure)
│                           └── ui/index.js plain creators: showToast, toggleTheme, dismissAlert …
├── reducers/
│   ├── factory.js          createCrudReducer — 12 CRUD flags (get/add/update/remove × request/success/failure)
│   ├── crops|orders|buyers|tasks|expenses|workers|attendance|equipment|maintenance/
│   ├── inventory/          items + usageHistory (usage decrements stock in the api)
│   ├── user/               { user:{username,role,displayName}, loginLoading, loginError, users[] }
│   ├── weather/            { status, data, error, lastUpdated }
│   ├── activity/           { logs[] }   alerts/ { dismissed[] }   ui/ { theme, toast, sidebar }
│   └── index.js            combineReducers — 15 slices
├── selectors/              components read state only through selectors
│   ├── entitySelectors.js  selectCropItems, selectWorkerItems, selectCurrentRole, selectCanModify …
│   ├── cropSelectors.js    stock rows, available stock, options, health counts, filters
│   ├── buyerSelectors|taskSelectors|summarySelectors|reportSelectors|weatherSelectors
│   └── selectAlerts|selectLowStock|selectDueCrops|selectProfitByCrop
└── middleware/
    ├── persistMiddleware.js  only *_success actions → write the changed namespace to localStorage
    └── activityLogger.js     *_success add/edit/delete/login → LOGACTIVITY thunk → activity log
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
* Rehydration on app start: `RESTORESESSION` + `GETCROPS/GETORDERS/…/GETACTIVITY`
  dispatched from `src/index.js` (api reads localStorage, falls back to demo seeds).

### localStorage keys

`agri_crops`, `agri_orders`, `agri_buyers`, `agri_tasks`, `agri_expenses`,
`agri_inventory` ({items, usageHistory}), `agri_workers`, `agri_attendance`,
`agri_equipment`, `agri_maintenance`, `agri_activity`, `agri_session`
({user:{username,role,displayName}}), `agri_users`, `agri_alerts`, `agri_ui` (theme + sidebar)

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

## Links

- **Live website:** https://hamnayahya416-sketch.github.io/agriculture-management-system/
- **GitHub repository:** https://github.com/hamnayahya416-sketch/agriculture-management-system
