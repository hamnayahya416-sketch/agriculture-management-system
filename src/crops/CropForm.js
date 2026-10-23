import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Card from "../common/Card";
import { addCrop, updateCrop } from "../store/actions/cropActions";
import { showToast } from "../store/actions/uiActions";
import {
  validateName,
  validateRequired,
  validateQuantity,
  validateDate,
} from "../utils/validators";

const CATEGORIES = ["Cereal", "Vegetable", "Fruit", "Fiber", "Other"];
const STATUSES = ["Healthy", "Needs Attention", "Critical"];
const UNITS = ["kg", "tons", "crates"];

const emptyForm = {
  name: "",
  field: "",
  category: "Cereal",
  healthScore: 80,
  status: "Healthy",
  cuttingDate: "",
  harvestQty: "",
  unit: "kg",
  price: "",
};

export default function CropForm({ crop, onDone }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (crop) {
      setForm({
        name: crop.name || "",
        field: crop.field || "",
        category: crop.category || "Cereal",
        healthScore:
          crop.healthScore === undefined || crop.healthScore === null
            ? 80
            : crop.healthScore,
        status: crop.status || "Healthy",
        cuttingDate: crop.cuttingDate || "",
        harvestQty: crop.harvestQty === undefined ? "" : crop.harvestQty,
        unit: crop.unit || "kg",
        price: crop.price === undefined ? "" : crop.price,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [crop]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const found = {};
    const nameError = validateName(form.name);
    if (nameError) found.name = nameError;
    const fieldError = validateRequired(form.field, "Field name");
    if (fieldError) found.field = fieldError;
    const score = Number(form.healthScore);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      found.healthScore = "Health score must be between 0 and 100.";
    }
    const qtyError = validateQuantity(form.harvestQty);
    if (qtyError) found.harvestQty = qtyError;
    const dateError = validateDate(form.cuttingDate, "Cutting date");
    if (dateError) found.cuttingDate = dateError;
    if (form.price !== "" && !(Number(form.price) >= 0)) {
      found.price = "Price must be 0 or greater.";
    }
    return found;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      dispatch(showToast({ tone: "error", message: "Please fix the highlighted fields." }));
      return;
    }

    const payload = {
      name: form.name.trim(),
      field: form.field.trim(),
      category: form.category,
      healthScore: Number(form.healthScore),
      status: form.status,
      cuttingDate: form.cuttingDate,
      harvestQty: Number(form.harvestQty),
      unit: form.unit,
      price: form.price === "" ? 0 : Number(form.price),
    };

    if (crop) {
      dispatch(updateCrop({ id: crop.id, ...payload }));
      dispatch(showToast({ tone: "success", message: `${payload.name} updated.` }));
    } else {
      dispatch(addCrop(payload));
      dispatch(showToast({ tone: "success", message: `${payload.name} added to the farm.` }));
    }

    if (onDone) onDone();
  }

  return (
    <Card
      title={crop ? `Edit crop — ${crop.name}` : "Add Crop"}
      subtitle="Fields marked with * are required"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field">
            <span>Crop name *</span>
            <input
              type="text"
              name="name"
              placeholder="e.g. Wheat"
              value={form.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <em>{errors.name}</em>}
          </label>

          <label className="field">
            <span>Field *</span>
            <input
              type="text"
              name="field"
              placeholder="e.g. North Field"
              value={form.field}
              onChange={handleChange}
              aria-invalid={Boolean(errors.field)}
            />
            {errors.field && <em>{errors.field}</em>}
          </label>

          <label className="field">
            <span>Category</span>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Health status</span>
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Health score (%) *</span>
            <input
              type="number"
              name="healthScore"
              min="0"
              max="100"
              value={form.healthScore}
              onChange={handleChange}
              aria-invalid={Boolean(errors.healthScore)}
            />
            {errors.healthScore && <em>{errors.healthScore}</em>}
          </label>

          <label className="field">
            <span>Cutting date *</span>
            <input
              type="date"
              name="cuttingDate"
              value={form.cuttingDate}
              onChange={handleChange}
              aria-invalid={Boolean(errors.cuttingDate)}
            />
            {errors.cuttingDate && <em>{errors.cuttingDate}</em>}
          </label>

          <label className="field">
            <span>Harvest quantity *</span>
            <input
              type="number"
              name="harvestQty"
              min="1"
              placeholder="e.g. 12000"
              value={form.harvestQty}
              onChange={handleChange}
              aria-invalid={Boolean(errors.harvestQty)}
            />
            {errors.harvestQty && <em>{errors.harvestQty}</em>}
          </label>

          <label className="field">
            <span>Unit</span>
            <select name="unit" value={form.unit} onChange={handleChange}>
              {UNITS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Price per unit ($)</span>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              placeholder="e.g. 0.45"
              value={form.price}
              onChange={handleChange}
              aria-invalid={Boolean(errors.price)}
            />
            {errors.price && <em>{errors.price}</em>}
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">
            {crop ? "Save changes" : "Add crop"}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => onDone && onDone()}>
            {crop ? "Cancel" : "Clear"}
          </button>
        </div>
      </form>
    </Card>
  );
}
