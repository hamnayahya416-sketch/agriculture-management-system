import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card.js";
import StatusBadge from "../common/StatusBadge.js";
import EmptyState from "../common/EmptyState.js";
import SearchBar from "../common/SearchBar.js";
import ConfirmModal from "../common/ConfirmModal.js";
import { selectEquipmentItems } from "../../redux/selectors/entitySelectors.js";
import { selectServiceDue } from "../../redux/selectors/workforceSelectors.js";
import { REMOVEEQUIPMENT } from "../../redux/actions/equipment/index.js";
import { showToast } from "../../redux/actions/ui/index.js";
import { formatDate, formatDayMonth } from "../../utils/formatters.js";
import useRole from "../../hooks/useRole.js";
import { IconEdit, IconTrash } from "../common/icons.js";

const STATUS_TONE = {
  Operational: "green",
  "Under Repair": "amber",
  Idle: "grey",
};

export default function EquipmentTable({ onEdit }) {
  const dispatch = useDispatch();
  const { canDelete } = useRole();
  const equipment = useSelector(selectEquipmentItems);
  const dueItems = useSelector((state) => selectServiceDue(state, 3650));
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState(null);

  const dueById = {};
  dueItems.forEach((item) => {
    dueById[item.id] = item;
  });

  const q = query.trim().toLowerCase();
  const rows = equipment.filter(
    (item) =>
      !q ||
      item.name.toLowerCase().includes(q) ||
      String(item.type || "").toLowerCase().includes(q) ||
      String(item.status || "").toLowerCase().includes(q)
  );

  function confirmDelete() {
    dispatch(
      REMOVEEQUIPMENT(
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
        title="Equipment"
        subtitle="Fleet, status and next service dates"
        action={
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search equipment…"
            label="Search equipment"
          />
        }
      >
        {rows.length === 0 ? (
          <EmptyState
            title="No equipment found"
            text="Nothing matches the current filter. Add a new machine to begin."
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Status</th>
                  <th>Last serviced</th>
                  <th>Next service</th>
                  <th>Interval</th>
                  {canDelete && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => {
                  const due = dueById[item.id];
                  return (
                    <tr key={item.id}>
                      <td>
                        <span className="cell-title">{item.name}</span>
                        <span className="cell-sub">{item.type}</span>
                      </td>
                      <td>
                        <StatusBadge tone={STATUS_TONE[item.status] || "grey"}>
                          {item.status}
                        </StatusBadge>
                      </td>
                      <td className="nowrap">{formatDate(item.lastServiceDate)}</td>
                      <td className="nowrap">
                        {due ? (
                          <>
                            <b>{formatDayMonth(due.dueDate)}</b>
                            <span className="cell-sub">
                              {due.daysLeft < 0
                                ? `${Math.abs(due.daysLeft)} day(s) overdue`
                                : due.daysLeft === 0
                                ? "Due today"
                                : `in ${due.daysLeft} day(s)`}
                            </span>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="nowrap">{item.serviceIntervalDays} days</td>
                      {canDelete && (
                        <td>
                          <div className="row-actions">
                            <button
                              type="button"
                              className="icon-btn"
                              aria-label={`Edit ${item.name}`}
                              onClick={() => onEdit && onEdit(item)}
                            >
                              <IconEdit size={16} />
                            </button>
                            <button
                              type="button"
                              className="icon-btn icon-btn--danger"
                              aria-label={`Delete ${item.name}`}
                              onClick={() => setTarget(item)}
                            >
                              <IconTrash size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmModal
        open={Boolean(target)}
        title="Delete equipment?"
        message={
          target
            ? `${target.name} will be permanently removed from the fleet.`
            : ""
        }
        confirmLabel="Delete equipment"
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
