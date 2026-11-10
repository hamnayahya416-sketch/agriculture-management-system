import { KEYS, ok, bad, readValue, writeValue } from "../index.js";
import { SEED_INVENTORY } from "../../../../fake-db/seedData.js";
import { nextPrefixedId } from "../../../utils/id.js";

/* Storage holds { items, usageHistory }. Older builds stored a bare list
   or { items, usage } — both are migrated on read. */
export function read() {
  const raw = readValue(KEYS.inventory, null);
  if (raw === null || raw === undefined) {
    return { items: [...SEED_INVENTORY.items], usageHistory: [...SEED_INVENTORY.usage] };
  }
  if (Array.isArray(raw)) {
    return { items: raw, usageHistory: [] };
  }
  const items = Array.isArray(raw.items) ? raw.items : [...SEED_INVENTORY.items];
  const usage = raw.usageHistory || raw.usage || [];
  return { items, usageHistory: Array.isArray(usage) ? usage : [] };
}

function write(state) {
  return writeValue(KEYS.inventory, state);
}

export function getAll() {
  return ok(read(), "Inventory loaded.");
}

export function save(input) {
  const state = read();
  const item = { ...input };
  if (!item.id) item.id = nextPrefixedId(state.items, "INV");
  state.items.push(item);
  if (!write(state)) return bad("Storage is full — item was not saved.");
  return ok(state, "Item saved.");
}

export function update(id, changes) {
  const state = read();
  const index = state.items.findIndex((entry) => String(entry.id) === String(id));
  if (index === -1) return bad("Item not found.");
  state.items[index] = { ...state.items[index], ...changes, id: state.items[index].id };
  if (!write(state)) return bad("Storage is full — item was not saved.");
  return ok(state, "Item updated.");
}

export function remove(id) {
  const state = read();
  const next = state.items.filter((entry) => String(entry.id) !== String(id));
  if (next.length === state.items.length) return bad("Item not found.");
  state.items = next;
  if (!write(state)) return bad("Storage is full — item was not removed.");
  return ok(state, "Item removed.");
}

/* Records usage and decrements the item quantity in one transaction. */
export function addUsage({ itemId, qty, unit, note, date }) {
  const state = read();
  const index = state.items.findIndex((entry) => String(entry.id) === String(itemId));
  if (index === -1) return bad("Item not found.");
  const amount = Number(qty);
  if (!Number.isFinite(amount) || amount <= 0) return bad("Quantity must be greater than 0.");
  const item = state.items[index];
  if (amount > Number(item.qty)) {
    return bad(`Only ${item.qty} ${item.unit} of ${item.item} is in stock.`);
  }
  state.items[index] = { ...item, qty: Number(item.qty) - amount };
  const entry = {
    id: nextPrefixedId(state.usageHistory, "USE"),
    itemId: item.id,
    itemName: item.item,
    qty: amount,
    unit: unit || item.unit,
    date,
    note: note || "",
  };
  state.usageHistory.unshift(entry);
  if (!write(state)) return bad("Storage is full — usage was not recorded.");
  return ok({ ...state, usageEntry: entry }, "Usage recorded.");
}

const apiDefault = { getAll, save, update, remove, addUsage };
export default apiDefault;
