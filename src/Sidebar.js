import { IconClose, IconLeaf } from "./icons";
import { NAV } from "./nav";

export default function Sidebar({ page, setPage, open, collapsed, onClose }) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside
        className={`sidebar ${open ? "is-open" : ""} ${
          collapsed ? "is-collapsed" : ""
        }`}
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
            onClick={onClose}
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
                const active = page === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`nav-item ${active ? "is-active" : ""}`}
                    onClick={() => {
                      setPage(item.id);
                      onClose();
                    }}
                    aria-current={active ? "page" : undefined}
                    title={item.label}
                  >
                    <IconCmp size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar__foot">
          <span>AgriCore v1.0</span>
          <span>Farm workspace</span>
        </div>
      </aside>
    </>
  );
}
