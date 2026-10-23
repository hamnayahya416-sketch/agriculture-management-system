import { STORAGE_KEYS, writeStorage } from "../../api/storageApi";

/* Maps every persistent slice namespace to its localStorage key. */
const PERSIST_MAP = {
  crops: STORAGE_KEYS.crops,
  orders: STORAGE_KEYS.orders,
  buyers: STORAGE_KEYS.buyers,
  tasks: STORAGE_KEYS.tasks,
  expenses: STORAGE_KEYS.expenses,
  inventory: STORAGE_KEYS.inventory,
  activity: STORAGE_KEYS.activity,
  auth: STORAGE_KEYS.session,
  ui: STORAGE_KEYS.ui,
};

/* Ephemeral UI actions are not worth writing to storage. */
const SKIP_TYPES = new Set([
  "ui/showToast",
  "ui/hideToast",
  "ui/openSidebar",
  "ui/closeSidebar",
  "ui/toggleSidebar",
]);

function serialize(namespace, sliceState) {
  if (namespace === "ui") {
    return { theme: sliceState.theme, sidebarCollapsed: sliceState.sidebarCollapsed };
  }
  return sliceState;
}

/* After every relevant action, the changed slice is written to localStorage. */
const persistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  try {
    const type = action && typeof action.type === "string" ? action.type : "";
    if (SKIP_TYPES.has(type)) return result;
    const namespace = type.split("/")[0];
    const key = PERSIST_MAP[namespace];
    if (key) {
      writeStorage(key, serialize(namespace, store.getState()[namespace]));
    }
  } catch (error) {
    console.warn("AgriCore: persistMiddleware failed.", error);
  }
  return result;
};

export default persistMiddleware;
