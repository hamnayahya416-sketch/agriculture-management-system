import { useEffect, useState } from "react";
import { Badge, Card, PageHeader, Toast } from "./ui";
import { crops } from "./data";
import { IconArrowRight, IconCheckCircle, IconUpload } from "./icons";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  crop: "",
  quantity: "",
  date: "",
  notes: "",
};

export default function OrderForm({ onAddOrder, onShowOrders }) {
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: undefined });
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
    if (form.name.trim().length < 2) found.name = "Please enter your name.";
    if (!form.email.includes("@")) found.email = "Enter a valid email address.";
    if (!form.crop) found.crop = "Please choose a crop.";
    if (!form.quantity || Number(form.quantity) <= 0)
      found.quantity = "Enter a quantity greater than 0.";
    if (!form.address.trim()) found.address = "Enter a delivery address.";
    return found;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setToast({ tone: "error", message: "Please fill in all required fields." });
      return;
    }

    setSubmitting(true);
    const summary = `${form.quantity} kg of ${form.crop} for ${form.name}`;

    setTimeout(() => {
      const orderId = onAddOrder({
        customer: form.name,
        email: form.email,
        phone: form.phone || "—",
        crop: form.crop,
        quantity: Number(form.quantity),
        unit: "kg",
        date: new Date().toISOString().slice(0, 10),
        delivery: form.date || "To be confirmed",
        address: form.address,
        total: Number(form.quantity) * 0.5,
        status: "Pending",
        notes: form.notes,
        image: image ? image.url : null,
      });

      setSubmitting(false);
      setSuccess({ id: orderId, text: summary });
      setToast({ tone: "success", message: `Order ${orderId} created successfully.` });
      setForm(emptyForm);
      setImage(null);
    }, 450);
  }

  if (success) {
    return (
      <>
        <PageHeader
          title="New Order"
          description="Submit a new customer order."
        />

        <Card className="success-box">
          <span className="success-box__icon">
            <IconCheckCircle size={34} />
          </span>
          <h2>Form submitted successfully!</h2>
          <p>
            Your order <strong>{success.id}</strong> has been recorded with the
            status <Badge>Pending</Badge>.
          </p>
          <p className="muted">{success.text}</p>
          <div className="success-box__actions">
            <button type="button" className="btn" onClick={() => setSuccess(null)}>
              Submit another order
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onShowOrders}
            >
              View all orders
              <IconArrowRight size={16} />
            </button>
          </div>
        </Card>

        {toast && <Toast message={toast.message} tone={toast.tone} />}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="New Order"
        description="Fill in the customer details below to place a new order."
      />

      <div className="grid">
        <div className="span-8">
          <Card
            title="Order Details"
            subtitle="Fields marked with * are required"
          >
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <label className="field">
                  <span>Name *</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <em>{errors.name}</em>}
                </label>

                <label className="field">
                  <span>Email address *</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
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
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </label>

                <label className="field">
                  <span>Crop *</span>
                  <select
                    name="crop"
                    value={form.crop}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.crop)}
                  >
                    <option value="">Select crop</option>
                    {crops.map((crop) => (
                      <option key={crop.id} value={crop.name}>
                        {crop.name} ({crop.quantity.toLocaleString()} kg in
                        store)
                      </option>
                    ))}
                  </select>
                  {errors.crop && <em>{errors.crop}</em>}
                </label>

                <label className="field">
                  <span>Quantity (kg) *</span>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    placeholder="Enter quantity"
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
                    name="date"
                    value={form.date}
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
                <span className="upload__title">Upload a picture (optional)</span>
                {image ? (
                  <div className="upload__preview">
                    <img src={image.url} alt="Uploaded order attachment preview" />
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
                <button type="submit" className="btn" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Order"}
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
        </div>

        <div className="span-4">
          <Card title="What happens next?">
            <ol className="steps">
              <li>Your order is saved with the status “Pending”.</li>
              <li>Our team checks the stock and confirms the price.</li>
              <li>You receive an email with the delivery schedule.</li>
              <li>The crop is packed, delivered and marked “Delivered”.</li>
            </ol>
            <hr className="divider" />
            <p className="muted small">
              Need help? Call +1 555 0100 or email support@agricore.farm
            </p>
          </Card>
        </div>
      </div>

      {toast && <Toast message={toast.message} tone={toast.tone} />}
    </>
  );
}
