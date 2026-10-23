import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card";
import { logInventoryUsage } from "../store/actions/inventoryActions";
import { showToast } from "../store/actions/uiActions";
import { selectInventoryItems, selectCanModify } from "../store/selectors/entitySelectors";
import { validateQuantity, validateDate } from "../utils/validators";
import { formatNumber, todayIso } from "../utils/formatters";

const emptyForm = { itemId: "", qty: "", date: "", note: "" };

/* Consumes stock: dispatches inventory/logUsage which decrements the item. */
export default function UsageForm({ onDone }) {
  const dispatch = useDispatch();
  const items = useSelector(selectInventoryItems);
  const canModify = useSelector(selectCanModify);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ ...emptyForm, date: todayIso() });
    setErrors({});
  }, []);

  const selected = items.find((entry) => String(entry.id) === String(form.itemId));
  const available = selected ? Number(selected.qty) || 0 : undefined;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canModify) return;

    const found = {};
    if (!form.itemId) found.itemId = "Please choose an item.";
    const qtyError = validateQuantity(form.qty, available);
    if (qtyError) found.qty = qtyError;
    const dateError = validateDate(form.date, "Usage date");
    if (dateError) found.date = dateError;
    setErrors(found);
    if (Object.keys(found).length > 0) {
      dispatch(showToast({ tone: "error", message: "Please fix the highlighted fields." }));
      return;
    }

    dispatch(
      logInventoryUsage({
        itemId: selected.id,
        qty: Number(form.qty),
        unit: selected.unit,
        date: form.date,
        note: form.note.trim(),
      })
    );
    dispatch(
      showToast({
        tone: "success",
        message: `${formatNumber(form.qty)} ${selected.unit} of ${selected.item} used.`,
      })
    );
    setForm({ ...emptyForm, date: todayIso() });
    if (onDone) onDone();
  }

  return (
    <Card
      title="Log Usage"
      subtitle="Consuming an input automatically reduces its stock"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field">
            <span>Item *</span>
            <select
              name="itemId"
              value={form.itemId}
              onChange={handleChange}
              disabled={!canModify}
              aria-invalid={Boolean(errors.itemId)}
            >
              <option value="">Select item</option>
              {items.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.item} ({formatNumber(entry.qty)} {entry.unit} left)
                </option>
              ))}
            </select>
            {errors.itemId && <em>{errors.itemId}</em>}
          </label>

          <label className="field">
            <span>Quantity used *</span>
            <input
              type="number"
              name="qty"
              min="1"
              placeholder={
                available === undefined
                  ? "Select an item first"
                  : `Max ${formatNumber(available)}`
              }
              value={form.qty}
              onChange={handleChange}
              disabled={!canModify}
              aria-invalid={Boolean(errors.qty)}
            />
            {errors.qty && <em>{errors.qty}</em>}
          </label>

          <label className="field">
            <span>Date *</span>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              disabled={!canModify}
              aria-invalid={Boolean(errors.date)}
            />
            {errors.date && <em>{errors.date}</em>}
          </label>

          <label className="field">
            <span>Note</span>
            <input
              type="text"
              name="note"
              placeholder="e.g. Wheat top dressing"
              value={form.note}
              onChange={handleChange}
              disabled={!canModify}
            />
          </label>
        </div>

        {canModify && (
          <div className="form-actions">
            <button type="submit" className="btn">
              Log usage
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setForm({ ...emptyForm, date: todayIso() });
                setErrors({});
              }}
            >
              Clear
            </button>
          </div>
        )}
      </form>
    </Card>
  );
}
