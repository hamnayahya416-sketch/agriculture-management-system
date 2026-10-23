import { combineReducers } from "@reduxjs/toolkit";
import cropsReducer from "./reducers/cropsReducer";
import ordersReducer from "./reducers/ordersReducer";
import buyersReducer from "./reducers/buyersReducer";
import weatherReducer from "./reducers/weatherReducer";
import tasksReducer from "./reducers/tasksReducer";
import expensesReducer from "./reducers/expensesReducer";
import inventoryReducer from "./reducers/inventoryReducer";
import authReducer from "./reducers/authReducer";
import alertsReducer from "./reducers/alertsReducer";
import activityReducer from "./reducers/activityReducer";
import uiReducer from "./reducers/uiReducer";

const rootReducer = combineReducers({
  crops: cropsReducer,
  orders: ordersReducer,
  buyers: buyersReducer,
  weather: weatherReducer,
  tasks: tasksReducer,
  expenses: expensesReducer,
  inventory: inventoryReducer,
  auth: authReducer,
  alerts: alertsReducer,
  activity: activityReducer,
  ui: uiReducer,
});

export default rootReducer;
