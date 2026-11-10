/* Try/catch wrapped localStorage access. Never throws — returns fallbacks instead. */

export const STORAGE_KEYS = {
  crops: "agri_crops",
  orders: "agri_orders",
  buyers: "agri_buyers",
  tasks: "agri_tasks",
  expenses: "agri_expenses",
  inventory: "agri_inventory",
  activity: "agri_activity",
  session: "agri_session",
  ui: "agri_ui",
};

function getStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch (err) {
    return null;
  }
}

export function readStorage(key, fallback = null) {
  try {
    const store = getStorage();
    if (!store) return fallback;
    const raw = store.getItem(key);
    if (raw === null || raw === undefined || raw === "") return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed;
  } catch (err) {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    const store = getStorage();
    if (!store) return false;
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`AgriCore: could not save "${key}" to localStorage.`, err);
    return false;
  }
}

export function removeStorage(key) {
  try {
    const store = getStorage();
    if (!store) return false;
    store.removeItem(key);
    return true;
  } catch (err) {
    return false;
  }
}

/* Reads a whole map of storage keys: { stateKey: storageKey } -> { stateKey: value } */
export function readStorageMap(map, fallback = null) {
  const result = {};
  Object.keys(map).forEach((stateKey) => {
    result[stateKey] = readStorage(map[stateKey], fallback);
  });
  return result;
}
