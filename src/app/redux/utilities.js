/* =====================================================================
   utilities.js — shared action helpers + every action-type constant.
   Flow: component -> thunk -> REQUEST -> api -> SUCCESS/FAILURE -> reducer
   ===================================================================== */

export const REQUEST = (type) => ({ type });
export const SUCCESS = (type, payload) => ({ type, payload });
export const FAILURE = (type, payload) => ({ type, payload });

/* Builds the 12-constant CRUD group: GET / ADD / UPDATE / REMOVE
   x REQUEST / SUCCESS / FAILURE, e.g. CROP_REQUEST.GET_CROPS_REQUEST. */
function crudGroup(namespace, entity) {
  const up = entity.toUpperCase();
  const cap = entity.charAt(0).toUpperCase() + entity.slice(1);
  return {
    [`GET_${up}_REQUEST`]: `${namespace}/get_request`,
    [`GET_${up}_SUCCESS`]: `${namespace}/get_success`,
    [`GET_${up}_FAILURE`]: `${namespace}/get_failure`,
    [`ADD_${up}_REQUEST`]: `${namespace}/add_request`,
    [`ADD_${up}_SUCCESS`]: `${namespace}/add_success`,
    [`ADD_${up}_FAILURE`]: `${namespace}/add_failure`,
    [`UPDATE_${up}_REQUEST`]: `${namespace}/update_request`,
    [`UPDATE_${up}_SUCCESS`]: `${namespace}/update_success`,
    [`UPDATE_${up}_FAILURE`]: `${namespace}/update_failure`,
    [`REMOVE_${up}_REQUEST`]: `${namespace}/remove_request`,
    [`REMOVE_${up}_SUCCESS`]: `${namespace}/remove_success`,
    [`REMOVE_${up}_FAILURE`]: `${namespace}/remove_failure`,
    __entity: cap,
  };
}

/* ---------------------------------------------------------------- users */
export const USER_REQUEST = {
  LOGIN_REQUEST: "user/login_request",
  LOGIN_SUCCESS: "user/login_success",
  LOGIN_FAILURE: "user/login_failure",
  LOGOUT_REQUEST: "user/logout_request",
  LOGOUT_SUCCESS: "user/logout_success",
  LOGOUT_FAILURE: "user/logout_failure",
  CREATE_USER_REQUEST: "user/create_request",
  CREATE_USER_SUCCESS: "user/create_success",
  CREATE_USER_FAILURE: "user/create_failure",
  GET_ALL_USERS_REQUEST: "user/get_all_request",
  GET_ALL_USERS_SUCCESS: "user/get_all_success",
  GET_ALL_USERS_FAILURE: "user/get_all_failure",
  GET_USER_REQUEST: "user/get_request",
  GET_USER_SUCCESS: "user/get_success",
  GET_USER_FAILURE: "user/get_failure",
  UPDATE_USER_REQUEST: "user/update_request",
  UPDATE_USER_SUCCESS: "user/update_success",
  UPDATE_USER_FAILURE: "user/update_failure",
  REMOVE_USER_REQUEST: "user/remove_request",
  REMOVE_USER_SUCCESS: "user/remove_success",
  REMOVE_USER_FAILURE: "user/remove_failure",
  RESET_USER_DATA: "user/reset_user_data",
};

/* --------------------------------------------------------------- crops */
export const CROP_REQUEST = crudGroup("crops", "crop");

/* -------------------------------------------------------------- orders */
export const ORDER_REQUEST = crudGroup("orders", "order");

/* -------------------------------------------------------------- buyers */
export const BUYER_REQUEST = crudGroup("buyers", "buyer");

/* ------------------------------------------------------------- weather */
export const WEATHER_REQUEST = {
  FETCH_REQUEST: "weather/fetch_request",
  FETCH_SUCCESS: "weather/fetch_success",
  FETCH_FAILURE: "weather/fetch_failure",
};

/* --------------------------------------------------------------- tasks */
export const TASK_REQUEST = crudGroup("tasks", "task");

/* ----------------------------------------------------------- expenses */
export const EXPENSE_REQUEST = crudGroup("expenses", "expense");

/* --------------------------------------------------------- inventory */
export const INVENTORY_REQUEST = {
  GET_INVENTORY_REQUEST: "inventory/get_request",
  GET_INVENTORY_SUCCESS: "inventory/get_success",
  GET_INVENTORY_FAILURE: "inventory/get_failure",
  ADD_ITEM_REQUEST: "inventory/add_request",
  ADD_ITEM_SUCCESS: "inventory/add_success",
  ADD_ITEM_FAILURE: "inventory/add_failure",
  UPDATE_ITEM_REQUEST: "inventory/update_request",
  UPDATE_ITEM_SUCCESS: "inventory/update_success",
  UPDATE_ITEM_FAILURE: "inventory/update_failure",
  REMOVE_ITEM_REQUEST: "inventory/remove_request",
  REMOVE_ITEM_SUCCESS: "inventory/remove_success",
  REMOVE_ITEM_FAILURE: "inventory/remove_failure",
  ADD_USAGE_REQUEST: "inventory/add_usage_request",
  ADD_USAGE_SUCCESS: "inventory/add_usage_success",
  ADD_USAGE_FAILURE: "inventory/add_usage_failure",
};

/* ------------------------------------------------------------- workers */
export const WORKER_REQUEST = crudGroup("workers", "worker");

/* --------------------------------------------------------- attendance */
export const ATTENDANCE_REQUEST = crudGroup("attendance", "attendance");

/* ---------------------------------------------------------- equipment */
export const EQUIPMENT_REQUEST = crudGroup("equipment", "equipment");

/* -------------------------------------------------------- maintenance */
export const MAINTENANCE_REQUEST = crudGroup("maintenance", "service");

/* ----------------------------------------------------------- activity */
export const ACTIVITY_REQUEST = {
  GET_ACTIVITY_REQUEST: "activity/get_request",
  GET_ACTIVITY_SUCCESS: "activity/get_success",
  GET_ACTIVITY_FAILURE: "activity/get_failure",
  LOG_ACTIVITY_REQUEST: "activity/log_request",
  LOG_ACTIVITY_SUCCESS: "activity/log_success",
  LOG_ACTIVITY_FAILURE: "activity/log_failure",
  CLEAR_ACTIVITY_REQUEST: "activity/clear_request",
  CLEAR_ACTIVITY_SUCCESS: "activity/clear_success",
  CLEAR_ACTIVITY_FAILURE: "activity/clear_failure",
};

/* ------------------------------------------------------------------ ui */
export const UI = {
  TOGGLETHEME: "ui/toggle_theme",
  SETTHEME: "ui/set_theme",
  SHOWTOAST: "ui/show_toast",
  HIDETOAST: "ui/hide_toast",
  TOGGLESIDEBAR: "ui/toggle_sidebar",
  OPENSIDEBAR: "ui/open_sidebar",
  CLOSESIDEBAR: "ui/close_sidebar",
  SETSIDEBARCOLLAPSED: "ui/set_sidebar_collapsed",
  TOGGLESIDEBARCOLLAPSED: "ui/toggle_sidebar_collapsed",
};

/* -------------------------------------------------------------- alerts */
export const ALERT = {
  DISMISS: "alerts/dismiss",
  DISMISS_ALL: "alerts/dismiss_all",
  RESET: "alerts/reset",
};

/* Operation flag names kept on every CRUD slice, e.g. addLoading… */
export const CRUD_OPS = ["get", "add", "update", "remove"];

export function initialCrudFlags(moduleName) {
  return CRUD_OPS.reduce((acc, op) => {
    const f = flagsFor(moduleName, op);
    acc[f.loading] = false;
    acc[f.success] = false;
    acc[f.failure] = false;
    acc[f.error] = null;
    return acc;
  }, {});
}

/* Flag field names for one operation ("get" uses the module prefix). */
export function flagsFor(moduleName, op) {
  const base = op === "get" ? moduleName : op;
  return {
    loading: `${base}Loading`,
    success: `${base}Success`,
    failure: `${base}Failure`,
    error: `${base}Error`,
  };
}

/* Applies REQUEST / SUCCESS / FAILURE flag transitions for one operation. */
export function applyRequestFlags(state, moduleName, op) {
  const f = flagsFor(moduleName, op);
  return {
    ...state,
    [f.loading]: true,
    [f.success]: false,
    [f.failure]: false,
    [f.error]: null,
  };
}

export function applySuccessFlags(state, moduleName, op) {
  const f = flagsFor(moduleName, op);
  return {
    ...state,
    [f.loading]: false,
    [f.success]: true,
    [f.failure]: false,
    [f.error]: null,
  };
}

export function applyFailureFlags(state, moduleName, op, message) {
  const f = flagsFor(moduleName, op);
  return {
    ...state,
    [f.loading]: false,
    [f.success]: false,
    [f.failure]: true,
    [f.error]: message || "Request failed.",
  };
}
