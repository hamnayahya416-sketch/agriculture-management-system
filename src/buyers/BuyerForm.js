import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card";
import CnicInput from "./CnicInput";
import ImageUpload from "./ImageUpload";
import { saveBuyer } from "../store/thunks/saveBuyer";
import { showToast } from "../store/actions/uiActions";
import { selectCropOptions } from "../store/selectors/cropSelectors";
import {
  validateName,
  validateCnic,
  validateQuantity,
  validateDate,
} from "../utils/validators";
import { formatNumber, todayIso } from "../utils/formatters";
import { IconCheckCircle } from "../common/icons";

const emptyForm = {
  name: "",
  cnic: "",
  imageBase64: null,
  cropId: "",
  quantity: "",
  date: "",
};

export default function BuyerForm({ buyer, onDone }) {
  const dispatch = useDispatch();
  const cropOptions = useSelector(selectCropOptions);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (buyer) {
      setForm({
        name: buyer.name || "",
        cnic: buyer.cnic || "",
        imageBase64: buyer.imageBase64 || null,
        cropId: buyer.cropId === undefined ? "" : String(buyer.cropId),
        quantity: buyer.quantity === undefined ? "" : buyer.quantity,
        date: buyer.date || todayIso(),
      });
    } else {
      setForm({ ...emptyForm, date: todayIso() });
    }
    setErrors({});
  }, [buyer]);

  const selectedCrop = cropOptions.find(
    (crop) => String(crop.id) === String(form.cropId)
  );
  const refund =
    buyer && selectedCrop && String(buyer.cropId) === String(selectedCrop.id)
      ? Number(buyer.quantity) || 0
      : 0;
  const available = selectedCrop ? selectedCrop.available + refund : undefined;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, _form: undefined }));
  }

  function validate() {
    const found = {};
    const nameError = validateName(form.name);
    if (nameError) found.name = nameError;
    const cnicError = validateCnic(form.cnic);
    if (cnicError) found.cnic = cnicError;
    if (!form.imageBase64) found.imageBase64 = "A photo is required.";
    if (!form.cropId) found.cropId = "Please choose a crop.";
    const qtyError = validateQuantity(form.quantity, available);
    if (qtyError) found.quantity = qtyError;
    const dateError = validateDate(form.date, "Purchase date");
    if (dateError) found.date = dateError;
    return found;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      dispatch(showToast({ tone: "error", message: "Please fix the highlighted fields." }));
      return;
    }

    setSaving(true);
    try {
      await dispatch(
        saveBuyer({
          id: buyer ? buyer.id : undefined,
          name: form.name,
          cnic: form.cnic,
          imageBase64: form.imageBase64,
          cropId: form.cropId,
          quantity: Number(form.quantity),
          date: form.date,
        })
      ).unwrap();

      dispatch(
        showToast({
          tone: "success",
          message: buyer
            ? `${form.name.trim()} updated.`
            : `${form.name.trim()} registered — stock updated.`,
        })
      );
      if (!buyer) setForm({ ...emptyForm, date: todayIso() });
      if (onDone) onDone();
    } catch (message) {
      const cnicIssue = String(message).toLowerCase().includes("cnic");
      setErrors({
        ...(cnicIssue ? { cnic: message } : {}),
        _form: message,
      });
      dispatch(showToast({ tone: "error", message }));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card
      title={buyer ? `Edit buyer — ${buyer.name}` : "Register Buyer"}
      subtitle="Fields marked with * are required"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field">
            <span>Full name *</span>
            <input
              type="text"
              name="name"
              placeholder="e.g. Ayesha Khan"
              value={form.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <em>{errors.name}</em>}
          </label>

          <CnicInput
            value={form.cnic}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, cnic: value }))
            }
            error={errors.cnic}
          />

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
                  {crop.name} ({formatNumber(crop.available)} {crop.unit} available)
                </option>
              ))}
            </select>
            {errors.cropId && <em>{errors.cropId}</em>}
          </label>

          <label className="field">
            <span>Quantity ({selectedCrop ? selectedCrop.unit : "kg"}) *</span>
            <input
              type="number"
              name="quantity"
              min="1"
              placeholder={
                available === undefined
                  ? "Select a crop first"
                  : `Max ${formatNumber(available)}`
              }
              value={form.quantity}
              onChange={handleChange}
              aria-invalid={Boolean(errors.quantity)}
            />
            {errors.quantity && <em>{errors.quantity}</em>}
          </label>

          <label className="field">
            <span>Purchase date *</span>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              aria-invalid={Boolean(errors.date)}
            />
            {errors.date && <em>{errors.date}</em>}
          </label>
        </div>

        <ImageUpload
          value={form.imageBase64}
          onChange={(imageBase64) =>
            setForm((prev) => ({ ...prev, imageBase64 }))
          }
          error={errors.imageBase64}
        />

        {errors._form && (
          <p className="form-error" role="alert">
            {errors._form}
          </p>
        )}

        <div className="form-actions">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Saving…" : buyer ? "Save changes" : "Register buyer"}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              if (buyer) {
                if (onDone) onDone();
              } else {
                setForm({ ...emptyForm, date: todayIso() });
                setErrors({});
              }
            }}
            disabled={saving}
          >
            {buyer ? "Cancel" : "Clear"}
          </button>
          {!buyer && (
            <span className="cell-sub form-done-note">
              <IconCheckCircle size={14} /> Saved to localStorage — survives refresh.
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}
