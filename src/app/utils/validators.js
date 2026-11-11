/* Field validators. Every function returns null when valid, otherwise a message. */

const LETTERS_AND_SPACES = /^[A-Za-z]+(?:[ ]+[A-Za-z]+)*$/;

export function validateRequired(value, label = "This field") {
  if (value === null || value === undefined || String(value).trim() === "") {
    return `${label} is required.`;
  }
  return null;
}

export function validateName(value) {
  const name = String(value || "").trim();
  if (!name) return "Full name is required.";
  if (name.length < 3) return "Name must be at least 3 characters long.";
  if (!LETTERS_AND_SPACES.test(name)) return "Only letters and spaces are allowed.";
  return null;
}

export function digitsOf(value) {
  return String(value || "").replace(/\D/g, "");
}

export function formatCnic(value) {
  const digits = digitsOf(value).slice(0, 13);
  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 12);
  const part3 = digits.slice(12, 13);
  return [part1, part2, part3].filter(Boolean).join("-");
}

export function validateCnic(value) {
  const digits = digitsOf(value);
  if (!digits) return "CNIC is required.";
  if (digits.length !== 13) {
    return "CNIC must be exactly 13 digits in the format 12345-1234567-1.";
  }
  return null;
}

export function validateImage(file, { required = true } = {}) {
  if (!file) return required ? "A photo is required." : null;
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowed.includes(file.type)) return "Only JPG or PNG images are allowed.";
  if (file.size > 1024 * 1024) return "Image must be 1 MB or smaller.";
  return null;
}

export function validateQuantity(value, available) {
  if (value === "" || value === null || value === undefined) {
    return "Quantity is required.";
  }
  const qty = Number(value);
  if (!Number.isFinite(qty)) return "Quantity must be a number.";
  if (qty <= 0) return "Quantity must be greater than 0.";
  if (!Number.isInteger(qty)) return "Quantity must be a whole number.";
  if (typeof available === "number" && qty > available) {
    return `Quantity exceeds available stock (${available.toLocaleString()}).`;
  }
  return null;
}

export function validateAmount(value, label = "Amount") {
  if (value === "" || value === null || value === undefined) {
    return `${label} is required.`;
  }
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `${label} must be a number.`;
  if (amount <= 0) return `${label} must be greater than 0.`;
  return null;
}

export function validateDate(value, label = "Date") {
  if (!value) return `${label} is required.`;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return `${label} is not a valid date.`;
  return null;
}

export function validateLogin(username, password) {
  const errors = {};
  if (!String(username || "").trim()) errors.username = "Username is required.";
  if (!password) {
    errors.password = "Password is required.";
  } else if (String(password).length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

/* Phone: +country or plain digits, 7–15 digits total (E.164 friendly). */
export function validatePhone(value) {
  const raw = String(value || "").trim();
  if (!raw) return "Phone number is required.";
  if (!/^\+?[0-9\s\-()]{7,20}$/.test(raw)) {
    return "Phone must contain only digits, spaces, +, - or ().";
  }
  const digits = digitsOf(raw);
  if (digits.length < 7 || digits.length > 15) {
    return "Phone number must be between 7 and 15 digits.";
  }
  return null;
}

/* Daily/period wage: a positive number, optionally with up to 2 decimals. */
export function validateWage(value) {
  if (value === "" || value === null || value === undefined) return "Wage is required.";
  const wage = Number(value);
  if (!Number.isFinite(wage)) return "Wage must be a number.";
  if (wage <= 0) return "Wage must be greater than 0.";
  if (wage > 1000000) return "Wage looks too large.";
  return null;
}

/* Equipment service interval: whole days between 1 and 365. */
export function validateServiceInterval(value) {
  if (value === "" || value === null || value === undefined) {
    return "Service interval is required.";
  }
  const days = Number(value);
  if (!Number.isFinite(days)) return "Service interval must be a number.";
  if (!Number.isInteger(days)) return "Service interval must be whole days.";
  if (days < 1 || days > 365) return "Service interval must be between 1 and 365 days.";
  return null;
}
