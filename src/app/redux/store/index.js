import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers/index.js";
import persistMiddleware from "../middleware/persistMiddleware.js";
import activityLogger from "../middleware/activityLogger.js";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(activityLogger, persistMiddleware),
  devTools: true,
});

export default store;
