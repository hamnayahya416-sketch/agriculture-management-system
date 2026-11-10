import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "./index.css";
import "./app/assets/styles/custom.css";
import store from "./app/redux/store/index.js";
import {
  RESTORESESSION,
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

/* Rehydrate every slice through its GET thunk (api -> SUCCESS -> reducer). */
store.dispatch(RESTORESESSION());
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
