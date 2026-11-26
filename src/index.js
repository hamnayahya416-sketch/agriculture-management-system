import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "./index.css";
import "./app/assets/styles/custom.css";
import store from "./app/redux/store/index.js";
import {
  GETCROPS,
  GETORDERS,
  GETBUYERS,
  GETTASKS,
  GETEXPENSES,
  GETINVENTORY,
  GETWORKERS,
  GETATTENDANCE,
  GETEQUIPMENT,
  GETMAINTENANCE,
  GETACTIVITY,
} from "./app/redux/actions/index.js";
import App from "./app/App.jsx";
import { onUnauthorized } from "./app/redux/api/http.js";
import { USER_REQUEST } from "./app/redux/utilities.js";
import { showToast } from "./app/redux/actions/ui/index.js";

/* An expired/invalid JWT signs the user out and explains why. */
onUnauthorized(() => {
  store.dispatch({ type: USER_REQUEST.LOGOUT_SUCCESS });
  store.dispatch(
    showToast({ tone: "error", message: "Your session has expired. Please sign in again." })
  );
});

/* Rehydrate every slice through its GET thunk (api -> SUCCESS -> reducer). */
store.dispatch(GETCROPS());
store.dispatch(GETORDERS());
store.dispatch(GETBUYERS());
store.dispatch(GETTASKS());
store.dispatch(GETEXPENSES());
store.dispatch(GETINVENTORY());
store.dispatch(GETWORKERS());
store.dispatch(GETATTENDANCE());
store.dispatch(GETEQUIPMENT());
store.dispatch(GETMAINTENANCE());
store.dispatch(GETACTIVITY());

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>
);
