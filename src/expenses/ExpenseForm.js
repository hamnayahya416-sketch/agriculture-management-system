import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card";
import { addExpense, updateExpense } from "../store/actions/expenseActions";
import { showToast } from "../store/actions/uiActions";
import { selectCropOptions } from "../store/selectors/cropSelectors";
import { validateRequired, validateAmount, validateDate } from "../utils/validators";
import { todayIso } from "../utils/formatters";

export const EXPENSE_CATEGORIES = [
  "Seeds",
  "Fertilizer",
  "Pesticide",
  "Labour",
  "Fuel",
  "Irrigation",
  "Equipment",
  "Other",
];

const emptyForm = { cropId: "", category: "Seeds", amount: "", date: "", note: "" };

export default function ExpenseForm({ expense, onDone }) {
  const dispatch = useDispatch();
  const cropOptions = useSelector(selectCropOptions);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expense) {
      setForm({
        cropId: expense.cropId === undefined ? "" : String(expense.cropId),
        category: expense.category || "Seeds",
        amount: expense.amount === undefined ? "" : expense.amount,
        date: expense.date || todayIso(),
        note: expense.note || "",
      });
    } else {
      setForm({ ...emptyForm, date: todayIso() });
    }
    setErrors({});
  }, [expense]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = {};
    if (!form.cropId) found.cropId = "Please choose a crop.";
    const categoryError = validateRequired(form.category, "Category");
    if (categoryError) found.category = categoryError;
    const amountError = validateAmount(form.amount);
    if (amountError) found.amount = amountError;
    const dateError = validateDate(form.date, "Expense date");
    if (dateError) found.date = dateError;
    setErrors(found);
    if (Object.keys(found).length > 0) {
      dispatch(showToast({ tone: "error", message: "Please fix the highlighted fields." }));
      return;
    }

    const payload = {
      cropId: Number(form.cropId) || form.cropId,
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
      note: form.note.trim(),
    };

    if (expense) {
      dispatch(updateExpense({ ...payload, id: expense.id }));
      dispatch(showToast({ tone: "success", message: `${form.category} expense updated.` }));
      if (onDone) onDone();
    } else {
      dispatch(addExpense(payload));
      dispatch(
        showToast({
          tone: "success",
          message: `${form.category} expense of $${Number(form.amount).toLocaleString()} recorded.`,
        })
      );
      setForm({ ...emptyForm, date: todayIso() });
    }
  }

  return (
    <Card
      title={expense ? `Edit expense — ${expense.category}` : "Record Expense"}
      subtitle="Track spending against each crop"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field">
            <span>Crop *</span>
            <select
              name="cropId"
              value={form.cropId}
              onChange={handleChange}
              aria-invalid={Boolean(errors.cropId)}
            >
              <option value="">Select crop</option>
              {cropOptions.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name} — {crop.field}
                </option>
              ))}
            </select>
            {errors.cropId && <em>{errors.cropId}</em>}
          </label>

          <label className="field">
            <span>Category *</span>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              aria-invalid={Boolean(errors.category)}
            >
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <em>{errors.category}</em>}
          </label>

          <label className="field">
            <span>Amount ($) *</span>
            <input
              type="number"
              name="amount"
              min="1"
              step="0.01"
              placeholder="e.g. 1200"
              value={form.amount}
              onChange={handleChange}
              aria-invalid={Boolean(errors.amount)}
            />
            {errors.amount && <em>{errors.amount}</em>}
          </label>

          <label className="field">
            <span>Date *</span>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              aria-invalid={Boolean(errors.date)}
            />
            {errors.date && <em>{errors.date}</em>}
          </label>

          <label className="field field--full">
            <span>Note</span>
            <input
              type="text"
              name="note"
              placeholder="e.g. Urea top dressing for North Field"
              value={form.note}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">
            {expense ? "Save changes" : "Record expense"}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              if (expense) {
                if (onDone) onDone();
              } else {
                setForm({ ...emptyForm, date: todayIso() });
                setErrors({});
              }
            }}
          >
            {expense ? "Cancel" : "Clear"}
          </button>
        </div>
      </form>
    </Card>
  );
}
