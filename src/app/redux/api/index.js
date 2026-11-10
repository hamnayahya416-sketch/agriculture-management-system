/* =====================================================================
   api/index.js — promise based localStorage adapter.
   Every api call resolves to an axios shaped response:
   { data: { succeeded, message, data } }
   ===================================================================== */

export const KEYS = {
  crops: "agri_crops",
  orders: "agri_orders",
  buyers: "agri_buyers",
  tasks: "agri_tasks",
  expenses: "agri_expenses",
  inventory: "agri_inventory",
  workers: "agri_workers",
  attendance: "agri_attendance",
  equipment: "agri_equipment",
  maintenance: "agri_maintenance",
  activity: "agri_activity",
  session: "agri_session",
  users: "agri_users",
  ui: "agri_ui",
  alerts: "agri_alerts",
};

/* Standard response helpers ------------------------------------------- */
export function ok(data, message = "OK") {
  return Promise.resolve({ data: { succeeded: true, message, data } });
}

export function bad(message = "Request failed.") {
  return Promise.resolve({ data: { succeeded: false, message, data: null } });
}

function store() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch (err) {
    return null;
  }
}

function parse(raw) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    return undefined; // corrupted JSON
  }
}

/* ---------------------------------------------------------------- read */
/* Missing key -> seed (demo data). Corrupted JSON -> []. Never throws. */
export function readList(key, seed = []) {
  const ls = store();
  if (!ls) return Array.isArray(seed) ? [...seed] : [];
  let raw = null;
  try {
    raw = ls.getItem(key);
  } catch (err) {
    return [];
  }
  if (raw === null || raw === undefined || raw === "") {
    return Array.isArray(seed) ? [...seed] : [];
  }
  const parsed = parse(raw);
  if (parsed === undefined || parsed === null) return [];
  return Array.isArray(parsed) ? parsed : [];
}

export function readValue(key, fallback = null) {
  const ls = store();
  if (!ls) return fallback;
  let raw = null;
  try {
    raw = ls.getItem(key);
  } catch (err) {
    return fallback;
  }
  if (raw === null || raw === undefined || raw === "") return fallback;
  const parsed = parse(raw);
  return parsed === undefined ? fallback : parsed;
}

/* --------------------------------------------------------------- write */
/* Returns false when storage is full or unavailable. */
export function writeList(key, list) {
  return writeValue(key, Array.isArray(list) ? list : []);
}

export function writeValue(key, value) {
  const ls = store();
  if (!ls) return false;
  try {
    ls.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`AgriCore: could not save "${key}" to localStorage.`, err);
    return false;
  }
}

export function removeValue(key) {
  const ls = store();
  if (!ls) return false;
  try {
    ls.removeItem(key);
    return true;
  } catch (err) {
    return false;
  }
}

/* ---------------------------------------------------------------- misc */
let counter = 0;
export function uid(prefix = "ID") {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}

/* Promise based access, shaped like an axios call. */
export const storageApi = {
  get: (key, fallback = null) => ok(readValue(key, fallback), "Read OK"),
  set: (key, value) =>
    writeValue(key, value)
      ? ok(value, "Saved.")
      : bad("Storage is full — changes could not be saved."),
  remove: (key) =>
    removeValue(key) ? ok(null, "Removed.") : bad("Could not remove the value."),
};

/* Back-compat aliases used by older call sites. */
export const STORAGE_KEYS = KEYS;
export const readStorage = readValue;
export const writeStorage = writeValue;
export const removeStorage = removeValue;
