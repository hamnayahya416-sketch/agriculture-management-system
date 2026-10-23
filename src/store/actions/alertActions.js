import { alertsSlice } from "../reducers/alertsReducer";

/* Action types: alerts/dismiss, alerts/dismissAll, alerts/resetAlerts */
export const { dismiss: dismissAlert, dismissAll: dismissAllAlerts, resetAlerts } =
  alertsSlice.actions;
