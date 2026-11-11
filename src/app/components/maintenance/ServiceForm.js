import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card.js";
import { ADDSERVICE, UPDATESERVICE } from "../../redux/actions/maintenance/index.js";
import { showToast } from "../../redux/actions/ui/index.js";
import { selectEquipmentItems } from "../../redux/selectors/entitySelectors.js";
import {
  validateRequired,
  validateDate,
  validateAmount,
  hasErrors,
} from "../../utils/validators.js";
import { todayIso } from "../../utils/formatters.js";

const TYPES = ["Service", "Inspection", "Repair", "Other"];

const emptyForm = {
  equipmentId: "",
  date: "",
  type: "Service",
  cost: "",
  technician: "",
  notes: "",
};

export default function ServiceForm({ service, onDone }) {
  const dispatch = useDispatch();
  const equipment = useSelector(selectEquipmentItems);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (service) {
      setForm({
        equipmentId: service.equipmentId || "",
        date: service.date || todayIso(),
        type: service.type || "Service",
        cost: service.cost === undefined ? "" : service.cost,
        technician: service.technician || "",
        notes: service.notes || "",
      });
    } else {
      setForm({ ...emptyForm, date: todayIso() });
    }
    setErrors({});
  }, [service]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = {};
    const equipmentError = validateRequired(form.equipmentId, "Equipment");
    if (equipmentError) found.equipmentId = equipmentError;
    const dateError = validateDate(form.date, "Service date");
    if (dateError) found.date = dateError;
    const typeError = validateRequired(form.type, "Service type");
    if (typeError) found.type = typeError;
    const costError = validateAmount(form.cost, "Cost");
    if (costError) found.cost = costError;
    const techError = validateRequired(form.technician, "Technician");
    if (techError) found.technician = techError;
    setErrors(found);
    if (hasErrors(found)) {
      dispatch(showToast({ tone: "error", message: "Please fix the highlighted fields." }));
      return;
    }

    const payload = {
      equipmentId: form.equipmentId,
      date: form.date,
      type: form.type,
      cost: Number(form.cost),
      technician: form.technician.trim(),
      notes: form.notes.trim(),
    };

    if (service) {
      dispatch(
        UPDATESERVICE(
          { id: service.id, ...payload },
          () => {
            dispatch(showToast({ tone: "success", message: "Service record updated." }));
            if (onDone) onDone();
          },
          (message) => dispatch(showToast({ tone: "error", message }))
        )
      );
    } else {
      dispatch(
        ADDSERVICE(
          payload,
          () => {
            dispatch(showToast({ tone: "success", message: "Service logged." }));
            setForm({ ...emptyForm, date: todayIso() });
            setErrors({});
          },
          (message) => dispatch(showToast({ tone: "error", message }))
        )
      );
    }
  }

  return (
    <Card
      title={service ? "Edit service record" : "Log Service"}
      subtitle="Costs are added to expenses automatically"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field">
            <span>Equipment *</span>
            <select
              name="equipmentId"
              value={form.equipmentId}
              onChange={handleChange}
              aria-invalid={Boolean(errors.equipmentId)}
            >
              <option value="">Select equipment…</option>
              {equipment.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.equipmentId && <em>{errors.equipmentId}</em>}
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
            <span>Cost ($) *</span>
            <input
              type="number"
              name="cost"
              min="0"
              step="1"
              placeholder="e.g. 4500"
              value={form.cost}
              onChange={handleChange}
              aria-invalid={Boolean(errors.cost)}
            />
            {errors.cost && <em>{errors.cost}</em>}
          </label>

          <label className="field">
            <span>Technician *</span>
            <input
              type="text"
              name="technician"
              placeholder="e.g. Zahid Autos"
              value={form.technician}
              onChange={handleChange}
              aria-invalid={Boolean(errors.technician)}
            />
            {errors.technician && <em>{errors.technician}</em>}
          </label>

          <label className="field field--full">
            <span>Notes</span>
            <textarea
              name="notes"
              placeholder="e.g. Engine oil, filters, grease"
              value={form.notes}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">
            {service ? "Save changes" : "Log service"}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              if (service) {
                if (onDone) onDone();
              } else {
                setForm({ ...emptyForm, date: todayIso() });
                setErrors({});
              }
            }}
          >
            {service ? "Cancel" : "Clear"}
          </button>
        </div>
      </form>
    </Card>
  );
}
