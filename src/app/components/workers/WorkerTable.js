import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card.js";
import StatusBadge from "../common/StatusBadge.js";
import EmptyState from "../common/EmptyState.js";
import SearchBar from "../common/SearchBar.js";
import ConfirmModal from "../common/ConfirmModal.js";
import { selectWorkerItems } from "../../redux/selectors/entitySelectors.js";
import { REMOVEWORKER } from "../../redux/actions/workers/index.js";
import { showToast } from "../../redux/actions/ui/index.js";
import { formatDate, formatMoney } from "../../utils/formatters.js";
import useRole from "../../hooks/useRole.js";
import { IconEdit, IconTrash } from "../common/icons.js";

export default function WorkerTable({ onEdit }) {
  const dispatch = useDispatch();
  const { canDelete } = useRole();
  const workers = useSelector(selectWorkerItems);
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState(null);

  const q = query.trim().toLowerCase();
  const rows = workers.filter(
    (worker) =>
      !q ||
      worker.name.toLowerCase().includes(q) ||
      String(worker.job || "").toLowerCase().includes(q)
  );

  function confirmDelete() {
    dispatch(
      REMOVEWORKER(
        target.id,
        () => {
          dispatch(showToast({ tone: "success", message: `${target.name} removed.` }));
          setTarget(null);
        },
        (message) => dispatch(showToast({ tone: "error", message }))
      )
    );
  }

  return (
    <>
      <Card
        title="Workers"
        subtitle="Crew members, wages and join dates"
        action={
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search workers…"
            label="Search workers"
          />
        }
      >
        {rows.length === 0 ? (
          <EmptyState
            title="No workers found"
            text="Nothing matches the current filter. Add a new worker to begin."
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>Phone</th>
                  <th>Wage/day</th>
                  <th>Status</th>
                  <th>Joined</th>
                  {canDelete && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((worker) => (
                  <tr key={worker.id}>
                    <td>
                      <span className="cell-title">{worker.name}</span>
                      <span className="cell-sub">{worker.job}</span>
                    </td>
                    <td className="nowrap">{worker.phone || "—"}</td>
                    <td className="nowrap">
                      <b>{formatMoney(worker.wage)}</b>
                    </td>
                    <td>
                      <StatusBadge tone={worker.status === "Active" ? "green" : "grey"}>
                        {worker.status}
                      </StatusBadge>
                    </td>
                    <td className="nowrap">{formatDate(worker.joinedDate)}</td>
                    {canDelete && (
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label={`Edit ${worker.name}`}
                            onClick={() => onEdit && onEdit(worker)}
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            aria-label={`Delete ${worker.name}`}
                            onClick={() => setTarget(worker)}
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmModal
        open={Boolean(target)}
        title="Delete worker?"
        message={
          target
            ? `${target.name} will be permanently removed from the crew.`
            : ""
        }
        confirmLabel="Delete worker"
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
