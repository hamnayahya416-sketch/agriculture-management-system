import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { IconClose, IconLeaf } from "./icons";
import { NAV } from "../nav";
import { closeSidebar } from "../store/actions/uiActions";
import { selectSidebarCollapsed, selectSidebarOpen } from "../store/selectors/entitySelectors";

export default function Sidebar() {
  const dispatch = useDispatch();
  const open = useSelector(selectSidebarOpen);
  const collapsed = useSelector(selectSidebarCollapsed);

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={() => dispatch(closeSidebar())} />}

      <aside
        className={`sidebar ${open ? "is-open" : ""} ${collapsed ? "is-collapsed" : ""}`.trim()}
        aria-label="Sidebar"
      >
        <div className="sidebar__brand">
          <span className="brand__mark">
            <IconLeaf size={20} />
          </span>
          <span className="brand__text">
            <b>AgriCore</b>
            <small>Smart Agriculture Management System</small>
          </span>
          <button
            type="button"
            className="icon-btn sidebar__close"
            onClick={() => dispatch(closeSidebar())}
            aria-label="Close sidebar"
          >
            <IconClose size={18} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV.map((section) => (
            <div className="nav-group" key={section.group}>
              <span className="nav-group__label">{section.group}</span>
              {section.items.map((item) => {
                const IconCmp = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-item ${isActive ? "is-active" : ""}`.trim()
                    }
                    onClick={() => dispatch(closeSidebar())}
                    title={item.label}
                  >
                    <IconCmp size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar__foot">
          <span>AgriCore v2.0</span>
          <span>Redux edition</span>
        </div>
      </aside>
    </>
  );
}
