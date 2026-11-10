export default function Progress({ value, label }) {
  const safe = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  return (
    <div className="progress">
      <div
        className="progress__track"
        role="progressbar"
        aria-valuenow={safe}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress__fill" style={{ width: `${safe}%` }} />
      </div>
      <span className="progress__value">{label || `${safe}%`}</span>
    </div>
  );
}
