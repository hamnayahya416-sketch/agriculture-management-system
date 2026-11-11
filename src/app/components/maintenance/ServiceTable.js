import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card.js";
import StatusBadge from "../common/StatusBadge.js";
import EmptyState from "../common/EmptyState.js";
import SearchBar from "../common/SearchBar.js";
import ConfirmModal from "../common/ConfirmModal.js";
import {
  selectEquipmentItems,
  selectMaintenanceItems,
} from "../../redux/selectors/entitySelectors.js";
import { REMOVESERVICE } from "../../redux/actions/maintenance/index.js";
import { showToast } from "../../redux/actions/ui/index.js";
import { formatDate, formatMoney } from "../../utils/formatters.js";
import useRole from "../../hooks/useRole.js";
import { IconEdit, IconTrash } from "../common/icons.js";

const TYPE_TONE = {
  Service: "green",
  Inspection: "blue",
  Repair: "amber",
  Other: "grey",
};

export default function ServiceTable({ onEdit }) {
  const dispatch = useDispatch();
  const { canDelete } = useRole();
  const services = useSelector(selectMaintenanceItems);
  const equipment = useSelector(selectEquipmentItems);
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState(null);

  const nameById = {};
  equipment.forEach((item) => {
    nameById[item.id] = item.name;
  });

  const q = query.trim().toLowerCase();
  const rows = services
    .filter((entry) => {
      if (!q) return true;
      const name = nameById[entry.equipmentId] || "";
      return (
        name.toLowerCase().includes(q) ||
        String(entry.type || "").toLowerCase().includes(q) ||
        String(entry.technician || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  function confirmDelete() {
    dispatch(
      REMOVESERVICE(
        target.id,
        () => {
          dispatch(showToast({ tone: "success", message: "Service record removed." }));
          setTarget(null);
        },
        (message) => dispatch(showToast({ tone: "error", message }))
      )
    );
  }

  return (
    <>
      <Card
        title="Service log"
        subtitle="Every service, inspection and repair"
        action={
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search services…"
            label="Search services"
          />
        }
      >
        {rows.length === 0 ? (
          <EmptyState
            title="No services found"
            text="Nothing matches the current filter. Log a service to begin."
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Cost</th>
                  <th>Technician</th>
                  {canDelete && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      <span className="cell-title">
                        {nameById[entry.equipmentId] || "Unknown equipment"}
                      </span>
                      <span className="cell-sub">{entry.notes || "—"}</span>
                    </td>
                    <td className="nowrap">{formatDate(entry.date)}</td>
                    <td>
                      <StatusBadge tone={TYPE_TONE[entry.type] || "grey"}>
                        {entry.type}
                      </StatusBadge>
                    </td>
                    <td className="nowrap">
                      <b>{formatMoney(entry.cost)}</b>
                    </td>
                    <td className="nowrap">{entry.technician || "—"}</td>
                    {canDelete && (
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label="Edit service"
                            onClick={() => onEdit && onEdit(entry)}
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            aria-label="Delete service"
                            onClick={() => setTarget(entry)}
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
        title="Delete service record?"
        message="This service entry will be permanently removed."
        confirmLabel="Delete record"
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
