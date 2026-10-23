import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  IconBell,
  IconChevron,
  IconLogout,
  IconMenu,
  IconMoon,
  IconSun,
  IconUser,
} from "./icons";
import { pageTitleFor } from "../nav";
import { formatTodayLong, formatTimestamp } from "../utils/formatters";
import { logout } from "../store/actions/authActions";
import { dismissAlert, dismissAllAlerts } from "../store/actions/alertActions";
import { toggleTheme, showToast } from "../store/actions/uiActions";
import {
  selectCurrentRole,
  selectCurrentUser,
  selectTheme,
} from "../store/selectors/entitySelectors";
import { selectAlerts } from "../store/selectors/selectAlerts";

export default function Navbar({ onToggle }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const [panelOpen, setPanelOpen] = useState(false);

  const alerts = useSelector(selectAlerts);
  const theme = useSelector(selectTheme);
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectCurrentRole);

  function handleLogout() {
    setPanelOpen(false);
    dispatch(logout());
    dispatch(showToast({ message: "You have been logged out.", tone: "info" }));
  }

  return (
    <header className="header">
      <button
        type="button"
        className="icon-btn header__menu"
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        <IconMenu size={20} />
      </button>

      <nav className="crumb" aria-label="Breadcrumb">
        <span>AgriCore</span>
        <IconChevron size={14} />
        <b>{pageTitleFor(location.pathname)}</b>
      </nav>

      <div className="header__right">
        <span className="date-box header__date">{formatTodayLong()}</span>

        <div className="bell">
          <button
            type="button"
            className={`icon-btn ${alerts.length > 0 ? "has-alerts" : ""}`.trim()}
            onClick={() => setPanelOpen((value) => !value)}
            aria-label={`Alerts (${alerts.length} active)`}
            aria-expanded={panelOpen}
          >
            <IconBell size={19} />
            {alerts.length > 0 && (
              <span className="bell__count" aria-hidden="true">
                {alerts.length > 9 ? "9+" : alerts.length}
              </span>
            )}
          </button>

          {panelOpen && (
            <>
              <div className="bell__backdrop" onClick={() => setPanelOpen(false)} />
              <div className="bell__panel" role="dialog" aria-label="Alerts">
                <div className="bell__head">
                  <strong>Farm alerts</strong>
                  <span>{alerts.length} active</span>
                </div>
                {alerts.length === 0 ? (
                  <p className="bell__empty">All clear — no alerts right now.</p>
                ) : (
                  <ul>
                    {alerts.map((alert) => (
                      <li key={alert.id}>
                        <span className={`feed-dot feed-dot--${alert.severity}`} />
                        <span className="bell__body">
                          <b>{alert.title}</b>
                          <small>{alert.message}</small>
                        </span>
                        <button
                          type="button"
                          className="bell__dismiss"
                          onClick={() => dispatch(dismissAlert(alert.id))}
                          aria-label={`Dismiss ${alert.title}`}
                        >
                          Dismiss
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {alerts.length > 0 && (
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm bell__clear"
                    onClick={() => dispatch(dismissAllAlerts(alerts.map((alert) => alert.id)))}
                  >
                    Dismiss all
                  </button>
                )}
                <span className="bell__updated">Checked {formatTimestamp(new Date().toISOString())}</span>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          className="icon-btn"
          onClick={() => dispatch(toggleTheme())}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <IconSun size={19} /> : <IconMoon size={19} />}
        </button>

        <div className="user-chip">
          <span className="user-chip__avatar">
            <IconUser size={18} />
          </span>
          <span className="user-chip__text">
            <b>{user || "Guest"}</b>
            <small>{role || "No role"}</small>
          </span>
        </div>

        <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
          <IconLogout size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
