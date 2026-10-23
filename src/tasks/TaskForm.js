import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card";
import { addTask, updateTask } from "../store/actions/taskActions";
import { showToast } from "../store/actions/uiActions";
import { selectCropOptions } from "../store/selectors/cropSelectors";
import { validateRequired, validateDate } from "../utils/validators";
import { todayIso } from "../utils/formatters";

export const TASK_TYPES = ["Irrigation", "Fertilizer", "Spraying", "Labour", "Harvesting", "Other"];

const emptyForm = {
  title: "",
  type: "Irrigation",
  cropId: "",
  dueDate: "",
  status: "Pending",
};

export default function TaskForm({ task, onDone }) {
  const dispatch = useDispatch();
  const cropOptions = useSelector(selectCropOptions);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        type: task.type || "Irrigation",
        cropId: task.cropId === undefined ? "" : String(task.cropId),
        dueDate: task.dueDate || todayIso(),
        status: task.status || "Pending",
      });
    } else {
      setForm({ ...emptyForm, dueDate: todayIso() });
    }
    setErrors({});
  }, [task]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = {};
    const titleError = validateRequired(form.title, "Task title");
    if (titleError) found.title = titleError;
    if (!form.cropId) found.cropId = "Please choose a crop.";
    const dateError = validateDate(form.dueDate, "Due date");
    if (dateError) found.dueDate = dateError;
    setErrors(found);
    if (Object.keys(found).length > 0) {
      dispatch(showToast({ tone: "error", message: "Please fix the highlighted fields." }));
      return;
    }

    const payload = {
      title: form.title.trim(),
      type: form.type,
      cropId: Number(form.cropId) || form.cropId,
      dueDate: form.dueDate,
      status: form.status,
    };

    if (task) {
      dispatch(updateTask({ ...payload, id: task.id }));
      dispatch(showToast({ tone: "success", message: `Task “${payload.title}” updated.` }));
      if (onDone) onDone();
    } else {
      dispatch(addTask(payload));
      dispatch(showToast({ tone: "success", message: `Task “${payload.title}” scheduled.` }));
      setForm({ ...emptyForm, dueDate: todayIso() });
    }
  }

  return (
    <Card
      title={task ? `Edit task — ${task.title}` : "Schedule Task"}
      subtitle="Irrigation, fertilizer, spraying and labour work"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field field--full">
            <span>Task title *</span>
            <input
              type="text"
              name="title"
              placeholder="e.g. Irrigate North Field drip lines"
              value={form.title}
              onChange={handleChange}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && <em>{errors.title}</em>}
          </label>

          <label className="field">
            <span>Type *</span>
            <select name="type" value={form.type} onChange={handleChange}>
              {TASK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

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
            <span>Due date *</span>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              aria-invalid={Boolean(errors.dueDate)}
            />
            {errors.dueDate && <em>{errors.dueDate}</em>}
          </label>

          <label className="field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Done">Done</option>
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">
            {task ? "Save changes" : "Schedule task"}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              if (task) {
                if (onDone) onDone();
              } else {
                setForm({ ...emptyForm, dueDate: todayIso() });
                setErrors({});
              }
            }}
          >
            {task ? "Cancel" : "Clear"}
          </button>
        </div>
      </form>
    </Card>
  );
}
