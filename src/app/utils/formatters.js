/* Date / number / label formatting helpers. */

export function toIsoDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayIso() {
  return toIsoDate(new Date());
}

/* Local-noon date shifted by N days — avoids timezone off-by-one errors. */
export function dayOffsetIso(days) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return toIsoDate(d);
}

/* ISO date for `day` inside a month offset from the current month. */
export function monthOffsetIso(months, day) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(Math.max(1, day), lastDay));
  return toIsoDate(d);
}

export function parseIsoDate(iso) {
  if (!iso) return null;
  const [year, month, day] = String(iso).split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(iso, options = { day: "numeric", month: "short", year: "numeric" }) {
  const date = parseIsoDate(iso);
  if (!date) return "—";
  return date.toLocaleDateString("en-GB", options);
}

export function formatDayMonth(iso) {
  return formatDate(iso, { day: "numeric", month: "short" });
}

export function formatWeekday(iso, options = { weekday: "short" }) {
  const date = parseIsoDate(iso);
  if (!date) return "—";
  return date.toLocaleDateString("en-GB", options);
}

export function formatTodayLong() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTimestamp(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* Whole days from today until `iso` (negative = past). */
export function daysUntil(iso) {
  const target = parseIsoDate(iso);
  if (!target) return null;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.round(diff / 86400000);
}

export function formatNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString();
}

export function formatMoney(value, currency = "$") {
  const num = Number(value);
  if (!Number.isFinite(num)) return `${currency}0`;
  return `${currency}${num.toLocaleString(undefined, {
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatTonnes(kg) {
  const num = Number(kg);
  if (!Number.isFinite(num)) return "0 t";
  return `${(num / 1000).toFixed(1)} t`;
}

export function formatPercent(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0%";
  return `${Math.round(num)}%`;
}

export function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning ??";
  if (hour < 17) return "Good Afternoon ??";
  return "Good Evening ??";
}
