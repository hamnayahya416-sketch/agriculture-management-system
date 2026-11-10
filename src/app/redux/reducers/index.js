import { combineReducers } from "@reduxjs/toolkit";
import crops from "./crops/index.js";
import orders from "./orders/index.js";
import buyers from "./buyers/index.js";
import tasks from "./tasks/index.js";
import expenses from "./expenses/index.js";
import inventory from "./inventory/index.js";
import workers from "./workers/index.js";
import attendance from "./attendance/index.js";
import equipment from "./equipment/index.js";
import maintenance from "./maintenance/index.js";
import user from "./user/index.js";
import weather from "./weather/index.js";
import activity from "./activity/index.js";
import alerts from "./alerts/index.js";
import ui from "./ui/index.js";

const rootReducer = combineReducers({
  crops,
  orders,
  buyers,
  tasks,
  expenses,
  inventory,
  workers,
  attendance,
  equipment,
  maintenance,
  user,
  weather,
  activity,
  alerts,
  ui,
});

export default rootReducer;
