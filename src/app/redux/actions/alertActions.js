import { alertsSlice } from "../reducers/alertsReducer.js";

/* Action types: alerts/dismiss, alerts/dismissAll, alerts/resetAlerts */
export const { dismiss: dismissAlert, dismissAll: dismissAllAlerts, resetAlerts } =
  alertsSlice.actions;
