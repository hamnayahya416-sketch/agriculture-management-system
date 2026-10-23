const TONES = {
  Healthy: "green",
  Harvested: "green",
  Delivered: "green",
  Received: "green",
  "In stock": "green",
  Done: "green",
  "On track": "green",
  Active: "green",
  Admin: "green",
  Growing: "blue",
  Processing: "blue",
  "In transit": "blue",
  Scheduled: "blue",
  Manager: "blue",
  Packed: "violet",
  "Needs Attention": "amber",
  Pending: "amber",
  "Ready to harvest": "amber",
  "Low stock": "amber",
  "Due soon": "amber",
  Ordered: "amber",
  Warning: "amber",
  Cancelled: "red",
  "Out of stock": "red",
  Critical: "red",
  Overdue: "red",
  Danger: "red",
};

export default function StatusBadge({ children, tone, className = "" }) {
  const resolved = tone || TONES[children] || "grey";
  return (
    <span className={`badge badge--${resolved} ${className}`.trim()}>{children}</span>
  );
}
