import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Card from "../common/Card.js";
import { ADDWORKER, UPDATEWORKER } from "../../redux/actions/workers/index.js";
import { showToast } from "../../redux/actions/ui/index.js";
import {
  validateName,
  validateRequired,
  validatePhone,
  validateWage,
  validateDate,
  hasErrors,
} from "../../utils/validators.js";
import { todayIso } from "../../utils/formatters.js";

const emptyForm = {
  name: "",
  job: "",
  phone: "",
  wage: "",
  status: "Active",
  joinedDate: "",
  notes: "",
};

export default function WorkerForm({ worker, onDone }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (worker) {
      setForm({
        name: worker.name || "",
        job: worker.job || "",
        phone: worker.phone || "",
        wage: worker.wage === undefined ? "" : worker.wage,
        status: worker.status || "Active",
        joinedDate: worker.joinedDate || todayIso(),
        notes: worker.notes || "",
      });
    } else {
      setForm({ ...emptyForm, joinedDate: todayIso() });
    }
    setErrors({});
  }, [worker]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = {};
    const nameError = validateName(form.name);
    if (nameError) found.name = nameError;
    const jobError = validateRequired(form.job, "Job title");
    if (jobError) found.job = jobError;
    const phoneError = validatePhone(form.phone);
    if (phoneError) found.phone = phoneError;
    const wageError = validateWage(form.wage);
    if (wageError) found.wage = wageError;
    const dateError = validateDate(form.joinedDate, "Joined date");
    if (dateError) found.joinedDate = dateError;
    setErrors(found);
    if (hasErrors(found)) {
      dispatch(showToast({ tone: "error", message: "Please fix the highlighted fields." }));
      return;
    }

    const payload = {
      name: form.name.trim(),
      job: form.job.trim(),
      phone: form.phone.trim(),
      wage: Number(form.wage),
      status: form.status,
      joinedDate: form.joinedDate,
      notes: form.notes.trim(),
    };

    if (worker) {
      dispatch(
        UPDATEWORKER(
          { id: worker.id, ...payload },
          () => {
            dispatch(showToast({ tone: "success", message: `${payload.name} updated.` }));
            if (onDone) onDone();
          },
          (message) => dispatch(showToast({ tone: "error", message }))
        )
      );
    } else {
      dispatch(
        ADDWORKER(
          payload,
          () => {
            dispatch(showToast({ tone: "success", message: `${payload.name} added to the crew.` }));
            setForm({ ...emptyForm, joinedDate: todayIso() });
            setErrors({});
          },
          (message) => dispatch(showToast({ tone: "error", message }))
        )
      );
    }
  }

  return (
    <Card
      title={worker ? `Edit worker — ${worker.name}` : "Add Worker"}
      subtitle="Crew details, daily wage and joining date"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field">
            <span>Full name *</span>
            <input
              type="text"
              name="name"
              placeholder="e.g. Rafiq Ahmed"
              value={form.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <em>{errors.name}</em>}
          </label>

          <label className="field">
            <span>Job title *</span>
            <input
              type="text"
              name="job"
              placeholder="e.g. Field Supervisor"
              value={form.job}
              onChange={handleChange}
              aria-invalid={Boolean(errors.job)}
            />
            {errors.job && <em>{errors.job}</em>}
          </label>

          <label className="field">
            <span>Phone *</span>
            <input
              type="text"
              name="phone"
              placeholder="e.g. +92 300 1234567"
              value={form.phone}
              onChange={handleChange}
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && <em>{errors.phone}</em>}
          </label>

          <label className="field">
            <span>Daily wage ($) *</span>
            <input
              type="number"
              name="wage"
              min="0"
              step="50"
              placeholder="e.g. 1200"
              value={form.wage}
              onChange={handleChange}
              aria-invalid={Boolean(errors.wage)}
            />
            {errors.wage && <em>{errors.wage}</em>}
          </label>

          <label className="field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <label className="field">
            <span>Joined date *</span>
            <input
              type="date"
              name="joinedDate"
              value={form.joinedDate}
              onChange={handleChange}
              aria-invalid={Boolean(errors.joinedDate)}
            />
            {errors.joinedDate && <em>{errors.joinedDate}</em>}
          </label>

          <label className="field field--full">
            <span>Notes</span>
            <textarea
              name="notes"
              placeholder="e.g. Licensed driver, night shift"
              value={form.notes}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">
            {worker ? "Save changes" : "Add worker"}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              if (worker) {
                if (onDone) onDone();
              } else {
                setForm({ ...emptyForm, joinedDate: todayIso() });
                setErrors({});
              }
            }}
          >
            {worker ? "Cancel" : "Clear"}
          </button>
        </div>
      </form>
    </Card>
  );
}
