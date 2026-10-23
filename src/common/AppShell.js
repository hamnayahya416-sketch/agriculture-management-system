import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "./Toast";
import {
  closeSidebar,
  toggleSidebar,
  toggleSidebarCollapsed,
} from "../store/actions/uiActions";
import { selectTheme } from "../store/selectors/entitySelectors";

export default function AppShell() {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    dispatch(closeSidebar());
  }, [location.pathname, dispatch]);

  function handleToggle() {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      dispatch(toggleSidebar());
    } else {
      dispatch(toggleSidebarCollapsed());
    }
  }

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <Sidebar />

      <div className="app__body">
        <Navbar onToggle={handleToggle} />

        <main className="content" id="main-content">
          <Outlet />
        </main>

        <Footer />
      </div>

      <Toast />
    </div>
  );
}
