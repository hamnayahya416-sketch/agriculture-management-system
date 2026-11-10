/* Raw state accessors. Components read slices through these, never state.x directly. */

export const selectCropItems = (state) => state.crops.items;
export const selectOrderItems = (state) => state.orders.items;
export const selectBuyerItems = (state) => state.buyers.items;
export const selectTaskItems = (state) => state.tasks.items;
export const selectExpenseItems = (state) => state.expenses.items;
export const selectInventoryItems = (state) => state.inventory.items;
export const selectInventoryUsage = (state) => state.inventory.usage;
export const selectWeatherState = (state) => state.weather;
export const selectActivityItems = (state) => state.activity.items;
export const selectDismissedAlerts = (state) => state.alerts.dismissed;

export const selectAuthState = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentRole = (state) => state.auth.role;
export const selectAuthError = (state) => state.auth.error;

/* Admin can edit/delete everything; Manager can only view and add. */
export const selectCanModify = (state) => state.auth.role === "Admin";
export const selectIsManager = (state) => state.auth.role === "Manager";

export const selectUiState = (state) => state.ui;
export const selectTheme = (state) => state.ui.theme;
export const selectToast = (state) => state.ui.toast;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
