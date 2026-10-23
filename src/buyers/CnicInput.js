import { formatCnic } from "../utils/validators";

/* CNIC field with live 12345-1234567-1 dash formatting. */
export default function CnicInput({ value, onChange, error, disabled = false }) {
  function handleChange(event) {
    onChange(formatCnic(event.target.value));
  }

  return (
    <label className="field">
      <span>CNIC *</span>
      <input
        type="text"
        inputMode="numeric"
        name="cnic"
        maxLength={15}
        placeholder="35202-1234567-1"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="cnic-input"
        aria-invalid={Boolean(error)}
      />
      {error ? <em>{error}</em> : <em className="field__hint">Format: 12345-1234567-1</em>}
    </label>
  );
}
