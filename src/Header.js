import { useState } from "react";
import { IconBell, IconChevron, IconMenu, IconUser } from "./icons";
import { PAGE_META } from "./nav";
import { recentActivity } from "./data";

export default function Header({ page, onToggle, orders }) {
  const [bellOpen, setBellOpen] = useState(false);
  const meta = PAGE_META[page];
  const feed = recentActivity(orders, 5);

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
        <span>{meta.crumb}</span>
        <IconChevron size={14} />
        <b>{meta.title}</b>
      </nav>

      <div className="header__right">
        <div className="bell">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setBellOpen((value) => !value)}
            aria-label="Notifications"
            aria-expanded={bellOpen}
          >
            <IconBell size={19} />
            <i className="icon-btn__dot" />
          </button>

          {bellOpen && (
            <>
              <div
                className="bell__backdrop"
                onClick={() => setBellOpen(false)}
              />
              <div className="bell__panel" role="dialog" aria-label="Notifications">
                <div className="bell__head">
                  <strong>Recent activity</strong>
                  <span>Orders &amp; deliveries</span>
                </div>
                <ul>
                  {feed.map((item) => (
                    <li key={item.key}>
                      <span
                        className={`feed-dot feed-dot--${item.status
                          .toLowerCase()
                          .replace(/\s/g, "-")}`}
                      />
                      <span className="bell__body">
                        <b>{item.title}</b>
                        <small>{item.sub}</small>
                      </span>
                      <span className="bell__date">{item.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="user-chip">
          <span className="user-chip__avatar">
            <IconUser size={18} />
          </span>
          <span className="user-chip__text">
            <b>Hamna</b>
            <small>Farm Manager</small>
          </span>
        </div>
      </div>
    </header>
  );
}
