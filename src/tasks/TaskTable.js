import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import SearchBar from "../common/SearchBar";
import ConfirmModal from "../common/ConfirmModal";
import { selectTaskRows } from "../store/selectors/taskSelectors";
import { selectCanModify } from "../store/selectors/entitySelectors";
import { removeTask, setTaskStatus } from "../store/actions/taskActions";
import { showToast } from "../store/actions/uiActions";
import { formatDayMonth } from "../utils/formatters";
import { IconEdit, IconTrash, IconCheckCircle, IconClock } from "../common/icons";

const STATUS_FILTERS = ["All", "Pending", "Overdue", "Done"];

function dueLabel(row) {
  if (row.daysRemaining === null) return "—";
  if (row.computedStatus === "Done") return "Completed";
  if (row.daysRemaining === 0) return "Due today";
  if (row.daysRemaining < 0) return `${Math.abs(row.daysRemaining)}d overdue`;
  return `in ${row.daysRemaining}d`;
}

export default function TaskTable({ onEdit }) {
  const dispatch = useDispatch();
  const canModify = useSelector(selectCanModify);
  const allRows = useSelector(selectTaskRows);
  const [view, setView] = useState({ status: "All", query: "" });
  const [target, setTarget] = useState(null);

  const query = view.query.trim().toLowerCase();
  const rows = allRows.filter((row) => {
    const matchesStatus = view.status === "All" || row.computedStatus === view.status;
    const matchesQuery =
      !query ||
      row.title.toLowerCase().includes(query) ||
      String(row.cropName).toLowerCase().includes(query) ||
      row.type.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  function update(patch) {
    setView((prev) => ({ ...prev, ...patch }));
  }

  function toggleDone(row) {
    const next = row.status === "Done" ? "Pending" : "Done";
    dispatch(setTaskStatus({ id: row.id, status: next }));
    dispatch(
      showToast({
        tone: "success",
        message: next === "Done" ? `“${row.title}” marked done.` : `“${row.title}” reopened.`,
      })
    );
  }

  function confirmDelete() {
    dispatch(removeTask(target.id));
    dispatch(showToast({ tone: "success", message: `Task “${target.title}” removed.` }));
    setTarget(null);
  }

  return (
    <>
      <Card
        title="Task Board"
        subtitle="Due dates, overdue work and completion in one place"
        action={
          <div className="crop-toolbar">
            <div className="chip-row">
              {STATUS_FILTERS.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`chip ${view.status === name ? "is-active" : ""}`.trim()}
                  onClick={() => update({ status: name })}
                  aria-pressed={view.status === name}
                >
                  {name}
                </button>
              ))}
            </div>
            <SearchBar
              value={view.query}
              onChange={(value) => update({ query: value })}
              placeholder="Search tasks…"
              label="Search tasks"
            />
          </div>
        }
      >
        {rows.length === 0 ? (
          <EmptyState
            title="No tasks found"
            text="Nothing matches the current filter. Schedule a new task to get started."
          />
        ) : (
          <ul className="task-list">
            {rows.map((row) => (
              <li key={row.id} className={`task-row task-row--${row.computedStatus.toLowerCase()}`}>
                <button
                  type="button"
                  className="task-check"
                  aria-label={
                    row.status === "Done"
                      ? `Reopen ${row.title}`
                      : `Mark ${row.title} as done`
                  }
                  disabled={!canModify}
                  onClick={() => toggleDone(row)}
                >
                  <IconCheckCircle size={20} />
                </button>

                <div className="task-row__body">
                  <span className={`task-row__title ${row.status === "Done" ? "is-done" : ""}`.trim()}>
                    {row.title}
                  </span>
                  <span className="cell-sub">
                    {row.type} · {row.cropName}
                  </span>
                </div>

                <div className="task-row__meta">
                  <StatusBadge>{row.computedStatus}</StatusBadge>
                  <span className="task-row__due">
                    <IconClock size={14} />
                    {formatDayMonth(row.dueDate)} · {dueLabel(row)}
                  </span>
                </div>

                {canModify && (
                  <div className="row-actions">
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Edit ${row.title}`}
                      onClick={() => onEdit && onEdit(row)}
                    >
                      <IconEdit size={16} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      aria-label={`Delete ${row.title}`}
                      onClick={() => setTarget(row)}
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ConfirmModal
        open={Boolean(target)}
        title="Delete task?"
        message={target ? `“${target.title}” will be permanently removed.` : ""}
        confirmLabel="Delete task"
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
