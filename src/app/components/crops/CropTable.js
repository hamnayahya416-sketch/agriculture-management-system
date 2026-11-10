import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card.js";
import StatusBadge from "../common/StatusBadge.js";
import EmptyState from "../common/EmptyState.js";
import SearchBar from "../common/SearchBar.js";
import ConfirmModal from "../common/ConfirmModal.js";
import { selectVisibleCrops } from "../../redux/selectors/cropSelectors.js";
import { selectCanModify } from "../../redux/selectors/entitySelectors.js";
import { REMOVECROP } from "../../redux/actions/crops/index.js";
import { showToast } from "../../redux/actions/ui/index.js";
import { formatDate, formatNumber } from "../../utils/formatters.js";
import { IconEdit, IconTrash } from "../common/icons.js";

const HEALTH_FILTERS = ["All", "Healthy", "Needs Attention", "Critical"];
const SORTS = [
  { value: "cuttingDate", label: "Cutting date" },
  { value: "quantity", label: "Quantity" },
  { value: "health", label: "Health score" },
  { value: "name", label: "Name (A–Z)" },
];

export default function CropTable({ onEdit }) {
  const dispatch = useDispatch();
  const canModify = useSelector(selectCanModify);
  const [view, setView] = useState({ health: "All", sort: "cuttingDate", query: "" });
  const [target, setTarget] = useState(null);

  const rows = useSelector((state) => selectVisibleCrops(state, view));

  function update(patch) {
    setView((prev) => ({ ...prev, ...patch }));
  }

  function confirmDelete() {
    const name = target.name;
    dispatch(
      REMOVECROP(
        target.id,
        () => dispatch(showToast({ tone: "success", message: `${name} removed.` })),
        (message) => dispatch(showToast({ tone: "error", message }))
      )
    );
    setTarget(null);
  }

  return (
    <>
      <Card
        title="Crop Records"
        subtitle="Search, filter by health and sort the crop list"
        action={
          <div className="crop-toolbar">
            <div className="chip-row">
              {HEALTH_FILTERS.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`chip ${view.health === name ? "is-active" : ""}`.trim()}
                  onClick={() => update({ health: name })}
                  aria-pressed={view.health === name}
                >
                  {name}
                </button>
              ))}
            </div>
            <select
              className="toolbar-select"
              value={view.sort}
              onChange={(event) => update({ sort: event.target.value })}
              aria-label="Sort crops"
            >
              {SORTS.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort: {option.label}
                </option>
              ))}
            </select>
            <SearchBar
              value={view.query}
              onChange={(value) => update({ query: value })}
              placeholder="Search crops…"
              label="Search crops"
            />
          </div>
        }
      >
        {rows.length === 0 ? (
          <EmptyState
            title="No crops found"
            text="Nothing matches the current filter. Adjust the search or add a new crop."
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Field</th>
                  <th>Health</th>
                  <th>Harvest qty</th>
                  <th>Cutting date</th>
                  <th>Available</th>
                  {canModify && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((crop) => (
                  <tr key={crop.id}>
                    <td>
                      <span className="cell-title">{crop.name}</span>
                      <span className="cell-sub">{crop.category}</span>
                    </td>
                    <td>{crop.field}</td>
                    <td>
                      <StatusBadge>{crop.status}</StatusBadge>
                      <span className="cell-sub">score {crop.healthScore}</span>
                    </td>
                    <td className="nowrap">
                      <b>{formatNumber(crop.harvestQty)}</b> {crop.unit}
                    </td>
                    <td className="nowrap">{formatDate(crop.cuttingDate)}</td>
                    <td className="nowrap">
                      {formatNumber(crop.available)} {crop.unit}
                    </td>
                    {canModify && (
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label={`Edit ${crop.name}`}
                            onClick={() => onEdit && onEdit(crop)}
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label={`Delete ${crop.name}`}
                            onClick={() => setTarget(crop)}
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
        title="Delete crop?"
        message={
          target
            ? `${target.name} will be permanently removed, along with its cutting schedule. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete crop"
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
