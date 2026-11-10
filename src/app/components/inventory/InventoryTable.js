import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card.js";
import StatusBadge from "../common/StatusBadge.js";
import EmptyState from "../common/EmptyState.js";
import SearchBar from "../common/SearchBar.js";
import ConfirmModal from "../common/ConfirmModal.js";
import {
  selectInventoryItems,
  selectCanModify,
} from "../../redux/selectors/entitySelectors.js";
import { selectStockStatus } from "../../redux/selectors/selectLowStock.js";
import { removeInventoryItem } from "../../redux/actions/inventoryActions.js";
import { showToast } from "../../redux/actions/uiActions.js";
import { formatNumber } from "../../utils/formatters.js";
import useDebounce from "../../hooks/useDebounce.js";
import { IconEdit, IconTrash } from "../common/icons.js";

export default function InventoryTable({ onEdit }) {
  const dispatch = useDispatch();
  const canModify = useSelector(selectCanModify);
  const items = useSelector(selectInventoryItems);
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const q = debouncedQuery.trim().toLowerCase();
  const rows = items.filter((item) =>
    [item.item, item.type, item.supplier || ""].some((field) =>
      field.toLowerCase().includes(q)
    )
  );

  function confirmDelete() {
    dispatch(removeInventoryItem(target.id));
    dispatch(showToast({ tone: "success", message: `${target.item} removed from inventory.` }));
    setTarget(null);
  }

  return (
    <>
      <Card
        title="Inventory"
        subtitle="Stock level of every input"
        action={
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search supplies…"
            label="Search supplies"
          />
        }
      >
        {rows.length === 0 ? (
          <EmptyState
            title="No supplies found"
            text={query ? `Nothing matches “${query}”. Try another keyword.` : "Add your first inventory item."}
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Supplier</th>
                  <th>Stock</th>
                  <th>Status</th>
                  {canModify && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="cell-title">{item.item}</span>
                      <span className="cell-sub">{item.id}</span>
                    </td>
                    <td>{item.type}</td>
                    <td>{item.supplier || "—"}</td>
                    <td className="nowrap">
                      <b>{formatNumber(item.qty)}</b> {item.unit}
                      <span className="cell-sub">min {item.minQty}</span>
                    </td>
                    <td>
                      <StatusBadge>{selectStockStatus(item)}</StatusBadge>
                    </td>
                    {canModify && (
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label={`Edit ${item.item}`}
                            onClick={() => onEdit && onEdit(item)}
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            aria-label={`Delete ${item.item}`}
                            onClick={() => setTarget(item)}
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
        title="Delete inventory item?"
        message={
          target
            ? `${target.item} will be removed. Existing usage history stays untouched.`
            : ""
        }
        confirmLabel="Delete item"
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
