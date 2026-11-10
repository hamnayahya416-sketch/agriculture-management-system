import { combineReducers } from "@reduxjs/toolkit";
import cropsReducer from "./cropsReducer.js";
import ordersReducer from "./ordersReducer.js";
import buyersReducer from "./buyersReducer.js";
import weatherReducer from "./weatherReducer.js";
import tasksReducer from "./tasksReducer.js";
import expensesReducer from "./expensesReducer.js";
import inventoryReducer from "./inventoryReducer.js";
import authReducer from "./authReducer.js";
import alertsReducer from "./alertsReducer.js";
import activityReducer from "./activityReducer.js";
import uiReducer from "./uiReducer.js";

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
