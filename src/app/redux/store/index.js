import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers/index.js";
import persistMiddleware from "../middleware/persistMiddleware.js";
import activityLogger from "../middleware/activityLogger.js";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      /* Thunks carry callbacks; payloads stay serializable but are not checked. */
      serializableCheck: false,
      immutableCheck: false,
    }).concat(activityLogger, persistMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
