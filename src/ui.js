import { IconInbox } from "./icons";

export function Card({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`card ${className}`.trim()}>
      {(title || action) && (
        <div className="card__head">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="card__body">{children}</div>
    </section>
  );
}

export function PageHeader({ title, description, action }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Stat({ icon, label, value, note, tone = "green" }) {
  return (
    <div className="stat-card">
      {icon && <span className={`stat-card__icon stat-card__icon--${tone}`}>{icon}</span>}
      <div className="stat-card__body">
        <span className="stat-card__label">{label}</span>
        <strong className="stat-card__value">{value}</strong>
        <span className="stat-card__note">{note}</span>
      </div>
    </div>
  );
}

const TONES = {
  Harvested: "green",
  Delivered: "green",
  Received: "green",
  "In stock": "green",
  Growing: "blue",
  Processing: "blue",
  "In transit": "blue",
  Packed: "violet",
  Pending: "amber",
  "Ready to harvest": "amber",
  "Low stock": "amber",
  Ordered: "amber",
  Cancelled: "red",
  "Out of stock": "red",
};

export function Badge({ children }) {
  const tone = TONES[children] || "grey";
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function Progress({ value, label }) {
  return (
    <div className="progress">
      <div
        className="progress__track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress__fill" style={{ width: `${value}%` }} />
      </div>
      <span className="progress__value">{label || `${value}%`}</span>
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">
        <IconInbox size={26} />
      </span>
      <h4>{title}</h4>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function Toast({ message, tone = "success" }) {
  return (
    <div className={`toast toast--${tone}`} role="status" aria-live="polite">
      <span className="toast__dot" />
      {message}
    </div>
  );
}
