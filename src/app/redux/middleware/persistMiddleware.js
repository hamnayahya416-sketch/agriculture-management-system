import { KEYS, writeValue, removeValue } from "../api/index.js";

/* Namespaces that persist, mapped to their localStorage key. */
const PERSIST_MAP = {
  crops: KEYS.crops,
  orders: KEYS.orders,
  buyers: KEYS.buyers,
  tasks: KEYS.tasks,
  expenses: KEYS.expenses,
  inventory: KEYS.inventory,
  workers: KEYS.workers,
  attendance: KEYS.attendance,
  equipment: KEYS.equipment,
  maintenance: KEYS.maintenance,
  activity: KEYS.activity,
  alerts: KEYS.alerts,
  ui: KEYS.ui,
  user: KEYS.session,
};

/* Which state field holds the list for each list slice. */
const LIST_KEY = {
  crops: "crops",
  orders: "orders",
  buyers: "buyers",
  tasks: "tasks",
  expenses: "expenses",
  workers: "workers",
  attendance: "records",
  equipment: "equipment",
  maintenance: "services",
};

/* Only successful mutations are written — requests/failures never touch storage. */
function opOf(type) {
  const parts = type.split("/");
  return parts[1] || "";
}

function serialize(namespace, sliceState) {
  if (LIST_KEY[namespace]) return sliceState[LIST_KEY[namespace]] || [];
  if (namespace === "inventory") {
    return { items: sliceState.items || [], usageHistory: sliceState.usageHistory || [] };
  }
  if (namespace === "activity") return sliceState.logs || [];
  if (namespace === "alerts") return { dismissed: sliceState.dismissed || [] };
  if (namespace === "ui") {
    return { theme: sliceState.theme, sidebarCollapsed: sliceState.sidebarCollapsed };
  }
  if (namespace === "user") return sliceState.user || null; // session shape
  return sliceState;
}

const persistMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  try {
    const type = action && typeof action.type === "string" ? action.type : "";
    if (!type.endsWith("_success")) return result;

    const namespace = type.split("/")[0];
    const key = PERSIST_MAP[namespace];
    if (!key) return result;

    const state = store.getState();
    const op = opOf(type);

    if (namespace === "user") {
      if (op === "login_success") writeValue(KEYS.session, { user: state.user.user });
      else if (op === "logout_success") removeValue(KEYS.session);
      else if (op !== "get_user_success") {
        /* user list management (create/update/remove/get_all) */
        writeValue(KEYS.users, state.user.users);
      }
      return result;
    }

    writeValue(key, serialize(namespace, state[namespace]));
  } catch (error) {
    console.warn("AgriCore: persistMiddleware failed.", error);
  }
  return result;
};

export default persistMiddleware;
