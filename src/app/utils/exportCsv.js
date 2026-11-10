/* CSV export helper (Excel friendly, UTF-8 BOM, proper escaping). */

function escapeCell(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function toCsv(rows, columns) {
  const keys =
    columns && columns.length
      ? columns.map((column) => column.key)
      : rows.length
        ? Object.keys(rows[0])
        : [];
  const header =
    columns && columns.length
      ? columns.map((column) => escapeCell(column.label)).join(",")
      : keys.map(escapeCell).join(",");

  const body = rows
    .map((row) => keys.map((key) => escapeCell(row[key])).join(","))
    .join("\r\n");

  return `${header}\r\n${body}`;
}

export function exportCsv(filename, rows, columns) {
  if (!rows || rows.length === 0) {
    console.warn("AgriCore: nothing to export.");
    return false;
  }
  const csv = toCsv(rows, columns);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
