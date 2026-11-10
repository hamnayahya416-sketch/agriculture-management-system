export default function StatCard({ icon, label, value, note, tone = "green" }) {
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
