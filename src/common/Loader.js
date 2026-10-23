export default function Loader({ label = "Loading…", full = false }) {
  return (
    <div className={`loader ${full ? "loader--full" : ""}`.trim()} role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true" />
      <span className="loader__label">{label}</span>
    </div>
  );
}
