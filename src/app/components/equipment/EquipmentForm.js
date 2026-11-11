import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Card from "../common/Card.js";
import { ADDEQUIPMENT, UPDATEEQUIPMENT } from "../../redux/actions/equipment/index.js";
import { showToast } from "../../redux/actions/ui/index.js";
import {
  validateRequired,
  validateDate,
  validateServiceInterval,
  hasErrors,
} from "../../utils/validators.js";

const TYPES = ["Tractor", "Harvester", "Water Pump", "Implement", "Sprayer", "Other"];
const STATUSES = ["Operational", "Under Repair", "Idle"];

const emptyForm = {
  name: "",
  type: "Tractor",
  status: "Operational",
  purchaseDate: "",
  lastServiceDate: "",
  serviceIntervalDays: "60",
  notes: "",
};

export default function EquipmentForm({ equipment, onDone }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (equipment) {
      setForm({
        name: equipment.name || "",
        type: equipment.type || "Tractor",
        status: equipment.status || "Operational",
        purchaseDate: equipment.purchaseDate || "",
        lastServiceDate: equipment.lastServiceDate || "",
        serviceIntervalDays:
          equipment.serviceIntervalDays === undefined ? "" : equipment.serviceIntervalDays,
        notes: equipment.notes || "",
      });
    } else {
      setForm({ ...emptyForm });
    }
    setErrors({});
  }, [equipment]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = {};
    const nameError = validateRequired(form.name, "Equipment name");
    if (nameError) found.name = nameError;
    const typeError = validateRequired(form.type, "Equipment type");
    if (typeError) found.type = typeError;
    const intervalError = validateServiceInterval(form.serviceIntervalDays);
    if (intervalError) found.serviceIntervalDays = intervalError;
    if (form.purchaseDate) {
      const purchaseError = validateDate(form.purchaseDate, "Purchase date");
      if (purchaseError) found.purchaseDate = purchaseError;
    }
    if (form.lastServiceDate) {
      const serviceError = validateDate(form.lastServiceDate, "Last service date");
      if (serviceError) found.lastServiceDate = serviceError;
    }
    setErrors(found);
    if (hasErrors(found)) {
      dispatch(showToast({ tone: "error", message: "Please fix the highlighted fields." }));
      return;
    }

    const payload = {
      name: form.name.trim(),
      type: form.type,
      status: form.status,
      purchaseDate: form.purchaseDate,
      lastServiceDate: form.lastServiceDate,
      serviceIntervalDays: Number(form.serviceIntervalDays),
      notes: form.notes.trim(),
    };

    if (equipment) {
      dispatch(
        UPDATEEQUIPMENT(
          { id: equipment.id, ...payload },
          () => {
            dispatch(showToast({ tone: "success", message: `${payload.name} updated.` }));
            if (onDone) onDone();
          },
          (message) => dispatch(showToast({ tone: "error", message }))
        )
      );
    } else {
      dispatch(
        ADDEQUIPMENT(
          payload,
          () => {
            dispatch(showToast({ tone: "success", message: `${payload.name} added to the fleet.` }));
            setForm({ ...emptyForm });
            setErrors({});
          },
          (message) => dispatch(showToast({ tone: "error", message }))
        )
      );
    }
  }

  return (
    <Card
      title={equipment ? `Edit equipment — ${equipment.name}` : "Add Equipment"}
      subtitle="Machinery details, status and service schedule"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field">
            <span>Equipment name *</span>
            <input
              type="text"
              name="name"
              placeholder="e.g. Massey Ferguson 385"
              value={form.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <em>{errors.name}</em>}
          </label>

          <label className="field">
            <span>Type *</span>
            <select name="type" value={form.type} onChange={handleChange}>
              {TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Service interval (days) *</span>
            <input
              type="number"
              name="serviceIntervalDays"
              min="1"
              max="365"
              step="1"
              placeholder="e.g. 60"
              value={form.serviceIntervalDays}
              onChange={handleChange}
              aria-invalid={Boolean(errors.serviceIntervalDays)}
            />
            {errors.serviceIntervalDays && <em>{errors.serviceIntervalDays}</em>}
          </label>

          <label className="field">
            <span>Purchase date</span>
            <input
              type="date"
              name="purchaseDate"
              value={form.purchaseDate}
              onChange={handleChange}
              aria-invalid={Boolean(errors.purchaseDate)}
            />
            {errors.purchaseDate && <em>{errors.purchaseDate}</em>}
          </label>

          <label className="field">
            <span>Last service date</span>
            <input
              type="date"
              name="lastServiceDate"
              value={form.lastServiceDate}
              onChange={handleChange}
              aria-invalid={Boolean(errors.lastServiceDate)}
            />
            {errors.lastServiceDate && <em>{errors.lastServiceDate}</em>}
          </label>

          <label className="field field--full">
            <span>Notes</span>
            <textarea
              name="notes"
              placeholder="e.g. Primary tillage, night shift"
              value={form.notes}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">
            {equipment ? "Save changes" : "Add equipment"}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              if (equipment) {
                if (onDone) onDone();
              } else {
                setForm({ ...emptyForm });
                setErrors({});
              }
            }}
          >
            {equipment ? "Cancel" : "Clear"}
          </button>
        </div>
      </form>
    </Card>
  );
}
