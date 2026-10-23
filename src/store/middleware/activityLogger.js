import { logActivity } from "../actions/activityActions";

/* Records every add / edit / delete into the activity slice. */
const TRACKED = {
  "crops/add": ["added", "Crop"],
  "crops/update": ["updated", "Crop"],
  "crops/remove": ["removed", "Crop"],
  "orders/add": ["added", "Order"],
  "orders/update": ["updated", "Order"],
  "orders/remove": ["removed", "Order"],
  "orders/setStatus": ["updated", "Order"],
  "buyers/add": ["added", "Buyer"],
  "buyers/update": ["updated", "Buyer"],
  "buyers/remove": ["removed", "Buyer"],
  "tasks/add": ["added", "Task"],
  "tasks/update": ["updated", "Task"],
  "tasks/remove": ["removed", "Task"],
  "tasks/setStatus": ["updated", "Task"],
  "expenses/add": ["added", "Expense"],
  "expenses/update": ["updated", "Expense"],
  "expenses/remove": ["removed", "Expense"],
  "inventory/add": ["added", "Inventory"],
  "inventory/update": ["updated", "Inventory"],
  "inventory/remove": ["removed", "Inventory"],
  "inventory/logUsage": ["used", "Inventory"],
  "auth/login": ["logged in", "Session"],
  "auth/logout": ["logged out", "Session"],
};

function labelFrom(payload, fallback) {
  if (payload === null || payload === undefined) return fallback;
  if (typeof payload !== "object") return String(payload);
  return (
    payload.name ||
    payload.title ||
    payload.customer ||
    payload.item ||
    payload.label ||
    payload.id ||
    ""
  );
}

const activityLogger = (store) => (next) => (action) => {
  const previousUser = store.getState().auth.user;
  const result = next(action);
  try {
    const tracked = TRACKED[action && action.type];
    if (tracked) {
      const [verb, entity] = tracked;
      const state = store.getState();
      const user = state.auth.user || previousUser || "guest";
      store.dispatch(
        logActivity({
          user,
          action: verb,
          entity,
          label: labelFrom(action.payload, entity),
          timestamp: new Date().toISOString(),
        })
      );
    }
  } catch (error) {
    console.warn("AgriCore: activityLogger failed.", error);
  }
  return result;
};

export default activityLogger;
