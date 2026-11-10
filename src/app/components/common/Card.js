export default function Card({ title, subtitle, action, children, className = "" }) {
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
