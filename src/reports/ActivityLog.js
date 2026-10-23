import { useState } from "react";
import { useSelector } from "react-redux";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import SearchBar from "../common/SearchBar";
import { selectActivityItems } from "../store/selectors/entitySelectors";
import { formatTimestamp } from "../utils/formatters";
import useDebounce from "../hooks/useDebounce";

const ACTION_FILTERS = ["All", "added", "updated", "removed", "used", "logged in", "logged out"];

export default function ActivityLog() {
  const activity = useSelector(selectActivityItems);
  const [action, setAction] = useState("All");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const q = debouncedQuery.trim().toLowerCase();
  const rows = activity.filter((entry) => {
    const matchesAction = action === "All" || entry.action === action;
    const matchesQuery =
      !q ||
      entry.user.toLowerCase().includes(q) ||
      entry.entity.toLowerCase().includes(q) ||
      String(entry.label || "").toLowerCase().includes(q);
    return matchesAction && matchesQuery;
  });

  return (
    <Card
      title="Activity Log"
      subtitle="Every change recorded by the app, newest first"
      action={
        <div className="crop-toolbar">
          <div className="chip-row">
            {ACTION_FILTERS.map((name) => (
              <button
                key={name}
                type="button"
                className={`chip ${action === name ? "is-active" : ""}`.trim()}
                onClick={() => setAction(name)}
                aria-pressed={action === name}
              >
                {name}
              </button>
            ))}
          </div>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search activity…"
            label="Search activity"
          />
        </div>
      }
    >
      {rows.length === 0 ? (
        <EmptyState
          title="No activity found"
          text="Actions like adding crops, orders and tasks will show up here."
        />
      ) : (
        <ul className="activity activity--full">
          {rows.map((entry) => (
            <li key={entry.id}>
              <span className={`feed-dot feed-dot--${entry.action}`} />
              <span className="activity__body">
                <b>
                  {entry.user} {entry.action} {entry.entity}
                </b>
                <small>{entry.label}</small>
              </span>
              <span className="activity__date">{formatTimestamp(entry.timestamp)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
