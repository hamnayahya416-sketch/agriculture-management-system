# AgriCore — Smart Agriculture Management System (Extended Redux Version)

A farm management app for crops, harvest & orders, buyers, tasks, expenses, inventory and reports —
built as the **U Devs Internship Task (Batch 6)** extended version with **Redux Toolkit**, **React Router**
and **role-based authentication**.

**Author:** Hamna Yahya — Batch 6, U Devs

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

---

## Tech stack

React 19 · Redux Toolkit 2 · React Router 7 (HashRouter) · Recharts 3 · Create React App 5 ·
Open-Meteo (weather) · localStorage persistence · Jest tests

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

```
src/store/
├── index.js                  configureStore + devTools + middleware stack
├── rootReducer.js            combineReducers of all 11 slices
├── reducers/
│   ├── cropsReducer.js       crops/add · update · remove · setAll
│   ├── ordersReducer.js      orders/add (computes total) · update · remove · setStatus
│   ├── buyersReducer.js      buyers/add · update · remove · setAll
│   ├── tasksReducer.js       tasks/add · update · remove · setStatus · setAll
│   ├── expensesReducer.js    expenses/add · update · remove · setAll
│   ├── inventoryReducer.js   inventory/add · update · remove · logUsage (decrements qty)
│   ├── activityReducer.js    activity/append · setAll
│   ├── alertsReducer.js      alerts/dismiss · restoreAll
│   ├── authReducer.js        auth/loginSuccess · logout (session persisted)
│   ├── uiReducer.js          ui/setTheme · toggleTheme · showToast · sidebar controls
│   └── weatherReducer.js     weather/pending · fulfilled · rejected (fetchWeather)
├── actions/                  thin re-exports of slice actions (10 modules)
├── thunks/
│   ├── fetchWeather.js       async: Open-Meteo forecast → weather/fulfilled
│   ├── loadFromStorage.js    async: hydrate all slices from localStorage (seed fallback)
│   └── saveBuyer.js          async: validates stock + duplicate CNIC → add/update buyer
├── selectors/
│   ├── entitySelectors.js    raw state accessors + selectCanModify (role gate)
│   ├── cropSelectors.js      stock rows, available stock, crop options, health counts
│   ├── buyerSelectors.js     debounced search by name/CNIC/crop
│   ├── summarySelectors.js   harvest/orders summaries, dashboard stats, chart series
│   ├── taskSelectors.js      task rows + computed Overdue, status counts
│   ├── reportSelectors.js    available months, monthly report, recent activity
│   ├── weatherSelectors.js   current weather, forecast, humidity level
│   ├── selectLowStock.js     low-stock items, stock status, type counts, usage rows
│   ├── selectDueCrops.js     cutting schedule / due crops
│   ├── selectProfitByCrop.js profit by crop, totals, 6-month P&L series
│   └── selectAlerts.js       combined alerts (weather + low stock + overdue + due crops)
└── middleware/
    ├── persistMiddleware.js  after every action → write the changed slice to localStorage
    └── activityLogger.js     auto-records user actions for the activity log
```

## Data flow

```
component
   │  dispatch(action | thunk)
   ▼
store middleware
   │  activityLogger  → appends activity entry
   │  persistMiddleware → writes changed slice to localStorage (agri_*)
   ▼
reducer (immer update, action types "namespace/action")
   ▼
selector (memoized createSelector — derived values: available stock,
          computed Overdue, summaries, chart series …)
   ▼
component re-renders
```

* Components never read `state.x` directly — always through selectors.
* Derived data (stock = harvestQty − sold, overdue = dueDate < today, summaries)
  is computed only in selectors, never stored.
* Hydration: `loadFromStorage` thunk on app start → localStorage or demo seed.

### localStorage keys

`agri_crops`, `agri_orders`, `agri_buyers`, `agri_tasks`, `agri_expenses`,
`agri_inventory` ({items, usage}), `agri_activity`, `agri_session`, `agri_ui` (theme + sidebar)

## Weather

Open-Meteo forecast for *Green Valley Farms, Punjab* (lat 31.5204, lon 74.3587),
auto-refreshed every 10 minutes via `useWeather` hook + `fetchWeather` thunk.

## Validation

Every form validates inline with `src/utils/validators.js` (required, CNIC = 13 digits with
live dash formatting, quantity ≤ available stock, dates, amounts, image JPG/PNG ≤ 1 MB)
plus success/error toasts via `ui/showToast`.

## Tests

`src/App.test.js` — renders the login page and blocks protected pages for unauthenticated users.

```bash
CI=true npm test -- --watchAll=false
```

## Live demo

https://hamnayahya416-sketch.github.io/agriculture-management-system/
