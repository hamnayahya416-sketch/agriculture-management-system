import { LOGACTIVITY } from "../actions/activity/index.js";

/* Every successful add / edit / delete / login becomes an activity entry. */
const TRACKED = {
  "crops/add_success": ["added", "Crop"],
  "crops/update_success": ["updated", "Crop"],
  "crops/remove_success": ["removed", "Crop"],
  "orders/add_success": ["added", "Order"],
  "orders/update_success": ["updated", "Order"],
  "orders/remove_success": ["removed", "Order"],
  "buyers/add_success": ["added", "Buyer"],
  "buyers/update_success": ["updated", "Buyer"],
  "buyers/remove_success": ["removed", "Buyer"],
  "tasks/add_success": ["added", "Task"],
  "tasks/update_success": ["updated", "Task"],
  "tasks/remove_success": ["removed", "Task"],
  "expenses/add_success": ["added", "Expense"],
  "expenses/update_success": ["updated", "Expense"],
  "expenses/remove_success": ["removed", "Expense"],
  "inventory/add_success": ["added", "Inventory"],
  "inventory/update_success": ["updated", "Inventory"],
  "inventory/remove_success": ["removed", "Inventory"],
  "inventory/add_usage_success": ["used", "Inventory"],
  "workers/add_success": ["added", "Worker"],
  "workers/update_success": ["updated", "Worker"],
  "workers/remove_success": ["removed", "Worker"],
  "attendance/add_success": ["marked", "Attendance"],
  "attendance/update_success": ["updated", "Attendance"],
  "attendance/remove_success": ["removed", "Attendance"],
  "equipment/add_success": ["added", "Equipment"],
  "equipment/update_success": ["updated", "Equipment"],
  "equipment/remove_success": ["removed", "Equipment"],
  "maintenance/add_success": ["serviced", "Maintenance"],
  "maintenance/update_success": ["updated", "Maintenance"],
  "maintenance/remove_success": ["removed", "Maintenance"],
  "user/login_success": ["logged in", "Session"],
  "user/logout_success": ["logged out", "Session"],
};

function labelFrom(payload, fallback) {
  if (payload === null || payload === undefined) return fallback;
  if (typeof payload !== "object") return String(payload);
  if (Array.isArray(payload)) return fallback;
  return (
    payload.name ||
    payload.title ||
    payload.customer ||
    payload.item ||
    payload.username ||
    payload.displayName ||
    payload.label ||
    payload.id ||
    fallback
  );
}

const activityLogger = (store) => (next) => (action) => {
  const previousUser = store.getState().user.user;
  const result = next(action);
  try {
    const type = action && action.type;
    const tracked = TRACKED[type];
    if (tracked) {
      const [verb, entity] = tracked;
      const state = store.getState();
      const current = state.user.user || previousUser;
      const user = current ? current.username : "guest";
      store.dispatch(
        LOGACTIVITY({
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
