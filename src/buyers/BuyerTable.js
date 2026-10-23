import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import SearchBar from "../common/SearchBar";
import ConfirmModal from "../common/ConfirmModal";
import BuyerDetailsModal from "./BuyerDetailsModal";
import {
  selectVisibleBuyers,
  selectAllBuyers,
} from "../store/selectors/buyerSelectors";
import { selectCanModify } from "../store/selectors/entitySelectors";
import { removeBuyer } from "../store/actions/buyerActions";
import { showToast } from "../store/actions/uiActions";
import { formatDate, formatNumber } from "../utils/formatters";
import { formatCnic } from "../utils/validators";
import useDebounce from "../hooks/useDebounce";
import { IconEdit, IconTrash, IconEye } from "../common/icons";

export default function BuyerTable({ onEdit }) {
  const dispatch = useDispatch();
  const canModify = useSelector(selectCanModify);
  const buyers = useSelector(selectAllBuyers);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const rows = useSelector((state) =>
    selectVisibleBuyers(state, { query: debouncedQuery })
  );

  function handleDelete() {
    dispatch(removeBuyer(deleting.id));
    dispatch(
      showToast({
        tone: "success",
        message: `${deleting.name} removed from buyers.`,
      })
    );
    setDeleting(null);
  }

  return (
    <>
      <Card
        title="Buyers"
        subtitle="All registered buyers with search by name or CNIC"
        action={
          <div className="buyer-toolbar">
            <span className="buyer-count">{buyers.length} total</span>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search by name or CNIC…"
              label="Search buyers"
            />
          </div>
        }
      >
        {rows.length === 0 ? (
          <EmptyState
            title={query ? "No matching buyers" : "No buyers yet"}
            text={
              query
                ? "Nothing matches your search. Try a different name or CNIC."
                : "Register your first buyer to start tracking sales."
            }
          />
        ) : (
          <div className="table-wrap">
            <table className="table buyer-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Buyer</th>
                  <th>Crop</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((buyer) => (
                  <tr key={buyer.id}>
                    <td>
                      <img
                        src={buyer.imageBase64}
                        alt={buyer.name}
                        className="buyer-thumb"
                      />
                    </td>
                    <td>
                      <span className="cell-title">{buyer.name}</span>
                      <span className="cell-sub">{formatCnic(buyer.cnic)}</span>
                    </td>
                    <td>{buyer.cropName || "—"}</td>
                    <td className="nowrap">
                      <b>{formatNumber(buyer.quantity)}</b> {buyer.unit || "kg"}
                    </td>
                    <td className="nowrap">{formatDate(buyer.date)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          aria-label={`View ${buyer.name}`}
                          onClick={() => setViewing(buyer)}
                        >
                          <IconEye size={16} />
                        </button>
                        {canModify && (
                          <>
                            <button
                              type="button"
                              className="icon-btn"
                              aria-label={`Edit ${buyer.name}`}
                              onClick={() => onEdit && onEdit(buyer)}
                            >
                              <IconEdit size={16} />
                            </button>
                            <button
                              type="button"
                              className="icon-btn icon-btn--danger"
                              aria-label={`Delete ${buyer.name}`}
                              onClick={() => setDeleting(buyer)}
                            >
                              <IconTrash size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <BuyerDetailsModal buyer={viewing} onClose={() => setViewing(null)} />

      <ConfirmModal
        open={Boolean(deleting)}
        title="Delete buyer?"
        message={
          deleting
            ? `${deleting.name} will be permanently removed from the buyers list. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete buyer"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
