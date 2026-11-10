import { UI, ALERT } from "../../utilities.js";

/* Plain action creators — no async work lives here. */

export const setTheme = (theme) => ({ type: UI.SETTHEME, payload: theme });
export const toggleTheme = () => ({ type: UI.TOGGLETHEME });

export const showToast = (payload) => ({
  type: UI.SHOWTOAST,
  payload: payload && payload.message
    ? { message: payload.message, tone: payload.tone || "success", id: payload.id }
    : { message: String(payload || ""), tone: "success", id: undefined },
});
export const hideToast = () => ({ type: UI.HIDETOAST });

export const toggleSidebar = () => ({ type: UI.TOGGLESIDEBAR });
export const openSidebar = () => ({ type: UI.OPENSIDEBAR });
export const closeSidebar = () => ({ type: UI.CLOSESIDEBAR });
export const setSidebarCollapsed = (value) => ({
  type: UI.SETSIDEBARCOLLAPSED,
  payload: Boolean(value),
});
export const toggleSidebarCollapsed = () => ({ type: UI.TOGGLESIDEBARCOLLAPSED });

/* Dismissed farm alerts (persisted with the alerts slice). */
export const dismissAlert = (id) => ({ type: ALERT.DISMISS, payload: id });
export const dismissAllAlerts = (ids) => ({ type: ALERT.DISMISS_ALL, payload: ids || [] });
export const resetAlerts = () => ({ type: ALERT.RESET });
