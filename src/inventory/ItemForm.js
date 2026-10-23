import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Card from "../common/Card";
import { addInventoryItem, updateInventoryItem } from "../store/actions/inventoryActions";
import { showToast } from "../store/actions/uiActions";
import { validateRequired, validateQuantity, validateAmount } from "../utils/validators";

export const INVENTORY_TYPES = ["Fertilizer", "Seed", "Pesticide", "Herbicide", "Fuel", "Other"];

const emptyForm = {
  item: "",
  type: "Fertilizer",
  qty: "",
  minQty: "",
  unit: "kg",
  supplier: "",
};

export default function ItemForm({ item, onDone }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setForm({
        item: item.item || "",
        type: item.type || "Fertilizer",
        qty: item.qty === undefined ? "" : item.qty,
        minQty: item.minQty === undefined ? "" : item.minQty,
        unit: item.unit || "kg",
        supplier: item.supplier || "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [item]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = {};
    const nameError = validateRequired(form.item, "Item name");
    if (nameError) found.item = nameError;
    const qtyError = validateQuantity(form.qty);
    if (qtyError) found.qty = qtyError;
    const minError = validateAmount(form.minQty, "Minimum quantity");
    if (minError) found.minQty = minError;
    const unitError = validateRequired(form.unit, "Unit");
    if (unitError) found.unit = unitError;
    setErrors(found);
    if (Object.keys(found).length > 0) {
      dispatch(showToast({ tone: "error", message: "Please fix the highlighted fields." }));
      return;
    }

    const payload = {
      item: form.item.trim(),
      type: form.type,
      qty: Number(form.qty),
      minQty: Number(form.minQty),
      unit: form.unit.trim(),
      supplier: form.supplier.trim(),
    };

    if (item) {
      dispatch(updateInventoryItem({ ...payload, id: item.id }));
      dispatch(showToast({ tone: "success", message: `${payload.item} updated.` }));
      if (onDone) onDone();
    } else {
      dispatch(addInventoryItem(payload));
      dispatch(showToast({ tone: "success", message: `${payload.item} added to inventory.` }));
      setForm(emptyForm);
    }
  }

  return (
    <Card
      title={item ? `Edit item — ${item.item}` : "Add Inventory Item"}
      subtitle="Fertilizer, seed, pesticide and other farm inputs"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field">
            <span>Item name *</span>
            <input
              type="text"
              name="item"
              placeholder="e.g. Urea Fertilizer"
              value={form.item}
              onChange={handleChange}
              aria-invalid={Boolean(errors.item)}
            />
            {errors.item && <em>{errors.item}</em>}
          </label>

          <label className="field">
            <span>Type *</span>
            <select name="type" value={form.type} onChange={handleChange}>
              {INVENTORY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Quantity in stock *</span>
            <input
              type="number"
              name="qty"
              min="0"
              placeholder="e.g. 500"
              value={form.qty}
              onChange={handleChange}
              aria-invalid={Boolean(errors.qty)}
            />
            {errors.qty && <em>{errors.qty}</em>}
          </label>

          <label className="field">
            <span>Minimum level *</span>
            <input
              type="number"
              name="minQty"
              min="0"
              placeholder="e.g. 100"
              value={form.minQty}
              onChange={handleChange}
              aria-invalid={Boolean(errors.minQty)}
            />
            {errors.minQty && <em>{errors.minQty}</em>}
          </label>

          <label className="field">
            <span>Unit *</span>
            <input
              type="text"
              name="unit"
              placeholder="kg / L / bags"
              value={form.unit}
              onChange={handleChange}
              aria-invalid={Boolean(errors.unit)}
            />
            {errors.unit && <em>{errors.unit}</em>}
          </label>

          <label className="field">
            <span>Supplier</span>
            <input
              type="text"
              name="supplier"
              placeholder="e.g. AgroChem Ltd."
              value={form.supplier}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">
            {item ? "Save changes" : "Add item"}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              if (item) {
                if (onDone) onDone();
              } else {
                setForm(emptyForm);
                setErrors({});
              }
            }}
          >
            {item ? "Cancel" : "Clear"}
          </button>
        </div>
      </form>
    </Card>
  );
}
