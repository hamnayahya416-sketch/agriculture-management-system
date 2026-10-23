import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import { addOrder } from "../store/actions/orderActions";
import { showToast } from "../store/actions/uiActions";
import { selectCropOptions } from "../store/selectors/cropSelectors";
import { validateQuantity, validateRequired } from "../utils/validators";
import { formatNumber, todayIso } from "../utils/formatters";
import { IconArrowRight, IconCheckCircle, IconUpload } from "../common/icons";

const emptyForm = {
  customer: "",
  email: "",
  phone: "",
  cropId: "",
  quantity: "",
  delivery: "",
  address: "",
  notes: "",
};

export default function OrderForm({ onShowOrders }) {
  const dispatch = useDispatch();
  const cropOptions = useSelector(selectCropOptions);

  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const selectedCrop = cropOptions.find(
    (crop) => String(crop.id) === String(form.cropId)
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage({ name: file.name, url: reader.result });
    reader.readAsDataURL(file);
  }

  function validate() {
    const found = {};
    const customerError = validateRequired(form.customer, "Customer name");
    if (customerError || form.customer.trim().length < 3) {
      found.customer = customerError || "Customer name must be at least 3 characters.";
    }
    if (!form.email.includes("@")) found.email = "Enter a valid email address.";
    if (!form.cropId) found.cropId = "Please choose a crop.";
    const quantityError = validateQuantity(
      form.quantity,
      selectedCrop ? selectedCrop.available : undefined
    );
    if (quantityError) found.quantity = quantityError;
    if (!form.address.trim()) found.address = "Enter a delivery address.";
    Object.keys(found).forEach((key) => {
      if (!found[key]) delete found[key];
    });
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

    const crop = selectedCrop;
    dispatch(
      addOrder({
        cropId: crop.id,
        customer: form.customer.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || "—",
        quantity: Number(form.quantity),
        price: crop.price,
        unit: crop.unit,
        orderDate: todayIso(),
        delivery: form.delivery || "To be confirmed",
        address: form.address.trim(),
        notes: form.notes.trim(),
        status: "Pending",
        image: image ? image.url : null,
      })
    );

    dispatch(
      showToast({
        tone: "success",
        message: `Order saved for ${form.customer.trim()} — stock updated.`,
      })
    );
    setSuccess(`${form.quantity} ${crop.unit} of ${crop.name} for ${form.customer.trim()}`);
    setForm(emptyForm);
    setImage(null);
    setErrors({});
  }

  if (success) {
    return (
      <Card className="success-box">
        <span className="success-box__icon">
          <IconCheckCircle size={34} />
        </span>
        <h2>Order submitted successfully!</h2>
        <p>
          The order has been recorded with status{" "}
          <StatusBadge>Pending</StatusBadge>.
        </p>
        <p className="muted">{success}</p>
        <div className="success-box__actions">
          <button type="button" className="btn" onClick={() => setSuccess(null)}>
            Submit another order
          </button>
          {onShowOrders && (
            <button type="button" className="btn btn--ghost" onClick={onShowOrders}>
              View all orders
              <IconArrowRight size={16} />
            </button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card title="New Order" subtitle="Fields marked with * are required">
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field">
            <span>Customer name *</span>
            <input
              type="text"
              name="customer"
              placeholder="e.g. Green Mart Supermarket"
              value={form.customer}
              onChange={handleChange}
              aria-invalid={Boolean(errors.customer)}
            />
            {errors.customer && <em>{errors.customer}</em>}
          </label>

          <label className="field">
            <span>Email address *</span>
            <input
              type="email"
              name="email"
              placeholder="orders@example.com"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <em>{errors.email}</em>}
          </label>

          <label className="field">
            <span>Phone number</span>
            <input
              type="tel"
              name="phone"
              placeholder="+1 555 0100"
              value={form.phone}
              onChange={handleChange}
            />
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
                selectedCrop
                  ? `Max ${formatNumber(selectedCrop.available)}`
                  : "Select a crop first"
              }
              value={form.quantity}
              onChange={handleChange}
              aria-invalid={Boolean(errors.quantity)}
            />
            {errors.quantity && <em>{errors.quantity}</em>}
          </label>

          <label className="field">
            <span>Delivery date</span>
            <input
              type="date"
              name="delivery"
              value={form.delivery}
              onChange={handleChange}
            />
          </label>

          <label className="field field--full">
            <span>Delivery address *</span>
            <input
              type="text"
              name="address"
              placeholder="Street, city, region"
              value={form.address}
              onChange={handleChange}
              aria-invalid={Boolean(errors.address)}
            />
            {errors.address && <em>{errors.address}</em>}
          </label>

          <label className="field field--full">
            <span>Additional notes</span>
            <textarea
              name="notes"
              rows="3"
              placeholder="Packaging preferences, quality grade, billing notes…"
              value={form.notes}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="upload">
          <span className="upload__title">Order attachment (optional)</span>
          {image ? (
            <div className="upload__preview">
              <img src={image.url} alt="Order attachment preview" />
              <div>
                <strong>{image.name}</strong>
                <button type="button" onClick={() => setImage(null)}>
                  Remove image
                </button>
              </div>
            </div>
          ) : (
            <label className="upload__box">
              <input type="file" accept="image/*" onChange={handleImage} />
              <IconUpload size={18} />
              <span>Click to choose an image from your computer</span>
            </label>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn">
            Submit Order
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setForm(emptyForm);
              setImage(null);
              setErrors({});
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </Card>
  );
}
