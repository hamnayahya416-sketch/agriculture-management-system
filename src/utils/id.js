/* Safe id generation for entities (numeric for crops, prefixed codes otherwise). */

export function nextNumericId(items) {
  const numbers = (items || [])
    .map((item) => Number(item && item.id))
    .filter((value) => Number.isFinite(value));
  return numbers.length ? Math.max(...numbers) + 1 : 1;
}

export function nextPrefixedId(items, prefix) {
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  let highest = 100;
  (items || []).forEach((item) => {
    const match = String(item && item.id).match(pattern);
    if (match) highest = Math.max(highest, Number(match[1]));
  });
  let candidate = `${prefix}-${highest + 1}`;
  const ids = new Set((items || []).map((item) => String(item && item.id)));
  while (ids.has(candidate)) {
    highest += 1;
    candidate = `${prefix}-${highest + 1}`;
  }
  return candidate;
}
