import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "./index.css";
import "./app/assets/styles/custom.css";
import store from "./app/redux/store/index.js";
import { loadFromStorage } from "./app/redux/thunks/loadFromStorage.js";
import App from "./app/App.jsx";

store.dispatch(loadFromStorage());

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
