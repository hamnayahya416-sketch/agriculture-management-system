/* Raw state accessors. Components read slices through these, never state.x directly. */

export const selectCropItems = (state) => state.crops.crops;
export const selectOrderItems = (state) => state.orders.orders;
export const selectBuyerItems = (state) => state.buyers.buyers;
export const selectTaskItems = (state) => state.tasks.tasks;
export const selectExpenseItems = (state) => state.expenses.expenses;
export const selectInventoryItems = (state) => state.inventory.items;
export const selectInventoryUsage = (state) => state.inventory.usageHistory;
export const selectWorkerItems = (state) => state.workers.workers;
export const selectAttendanceItems = (state) => state.attendance.records;
export const selectEquipmentItems = (state) => state.equipment.equipment;
export const selectMaintenanceItems = (state) => state.maintenance.services;
export const selectWeatherState = (state) => state.weather;
export const selectActivityItems = (state) => state.activity.logs;
export const selectDismissedAlerts = (state) => state.alerts.dismissed;

/* Auth — the user slice stores { username, role, displayName }. */
export const selectAuthState = (state) => state.user;
export const selectCurrentUser = (state) => (state.user.user ? state.user.user.username : null);
export const selectCurrentProfile = (state) => state.user.user;
export const selectCurrentRole = (state) => (state.user.user ? state.user.user.role : null);
export const selectAuthError = (state) => state.user.loginError;
export const selectLoginLoading = (state) => state.user.loginLoading;

/* Admin can edit/delete everything; Manager can only view and add. */
export const selectCanModify = (state) => selectCurrentRole(state) === "Admin";
export const selectIsManager = (state) => selectCurrentRole(state) === "Manager";

export const selectUiState = (state) => state.ui;
export const selectTheme = (state) => state.ui.theme;
export const selectToast = (state) => state.ui.toast;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;

/* Generic request flags per slice (loading / error selectors). */
export const selectCropsState = (state) => state.crops;
export const selectOrdersState = (state) => state.orders;
export const selectBuyersState = (state) => state.buyers;
export const selectTasksState = (state) => state.tasks;
export const selectExpensesState = (state) => state.expenses;
export const selectInventoryState = (state) => state.inventory;
export const selectWorkersState = (state) => state.workers;
export const selectAttendanceState = (state) => state.attendance;
export const selectEquipmentState = (state) => state.equipment;
export const selectMaintenanceState = (state) => state.maintenance;
