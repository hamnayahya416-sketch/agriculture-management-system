import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "./index.css";
import "./styles/custom.css";
import store from "./store";
import { loadFromStorage } from "./store/thunks/loadFromStorage";
import App from "./App";

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
