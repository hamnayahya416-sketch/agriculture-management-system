import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import SearchBar from "../common/SearchBar";
import ConfirmModal from "../common/ConfirmModal";
import { selectExpenseItems, selectCropItems, selectCanModify } from "../store/selectors/entitySelectors";
import { removeExpense } from "../store/actions/expenseActions";
import { showToast } from "../store/actions/uiActions";
import { formatDate, formatMoney } from "../utils/formatters";
import { exportCsv } from "../utils/exportCsv";
import useDebounce from "../hooks/useDebounce";
import { EXPENSE_CATEGORIES } from "./ExpenseForm";
import { IconEdit, IconTrash, IconDownload } from "../common/icons";

export default function ExpenseTable({ onEdit }) {
  const dispatch = useDispatch();
  const canModify = useSelector(selectCanModify);
  const expenses = useSelector(selectExpenseItems);
  const crops = useSelector(selectCropItems);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [target, setTarget] = useState(null);
  const debouncedQuery = useDebounce(query, 300);

  const cropName = (id) => {
    const crop = crops.find((entry) => String(entry.id) === String(id));
    return crop ? crop.name : "—";
  };

  const q = debouncedQuery.trim().toLowerCase();
  const rows = expenses.filter((entry) => {
    const matchesCategory = category === "All" || entry.category === category;
    const matchesQuery =
      !q ||
      entry.category.toLowerCase().includes(q) ||
      String(entry.note || "").toLowerCase().includes(q) ||
      cropName(entry.cropId).toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  function confirmDelete() {
    dispatch(removeExpense(target.id));
    dispatch(showToast({ tone: "success", message: "Expense removed." }));
    setTarget(null);
  }

  function handleExport() {
    const ok = exportCsv(
      "agricore-expenses.csv",
      rows.map((entry) => ({
        id: entry.id,
        date: entry.date,
        crop: cropName(entry.cropId),
        category: entry.category,
        amount: entry.amount,
        note: entry.note || "",
      })),
      [
        { key: "id", label: "ID" },
        { key: "date", label: "Date" },
        { key: "crop", label: "Crop" },
        { key: "category", label: "Category" },
        { key: "amount", label: "Amount ($)" },
        { key: "note", label: "Note" },
      ]
    );
    dispatch(
      showToast({
        tone: ok ? "success" : "error",
        message: ok ? "Expenses CSV downloaded." : "Nothing to export.",
      })
    );
  }

  return (
    <>
      <Card
        title="Expense Records"
        subtitle="All spending, filterable by category"
        action={
          <div className="crop-toolbar">
            <select
              className="toolbar-select"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
            >
              <option value="All">All categories</option>
              {EXPENSE_CATEGORIES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search expenses…"
              label="Search expenses"
            />
            <button type="button" className="btn btn--ghost" onClick={handleExport}>
              <IconDownload size={15} />
              CSV
            </button>
          </div>
        }
      >
        {rows.length === 0 ? (
          <EmptyState
            title="No expenses found"
            text="Nothing matches the current filter. Record a new expense to begin."
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Crop</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Note</th>
                  {canModify && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((entry) => (
                  <tr key={entry.id}>
                    <td className="nowrap">{formatDate(entry.date)}</td>
                    <td className="nowrap">{cropName(entry.cropId)}</td>
                    <td>
                      <span className="badge badge--blue">{entry.category}</span>
                    </td>
                    <td className="nowrap">
                      <b>{formatMoney(entry.amount)}</b>
                    </td>
                    <td className="muted">{entry.note || "—"}</td>
                    {canModify && (
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            aria-label="Edit expense"
                            onClick={() => onEdit && onEdit(entry)}
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn icon-btn--danger"
                            aria-label="Delete expense"
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
        title="Delete expense?"
        message={
          target
            ? `${target.category} expense of ${formatMoney(target.amount)} will be permanently removed.`
            : ""
        }
        confirmLabel="Delete expense"
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
