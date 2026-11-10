import { KEYS, ok, bad, readList, writeList } from "../index.js";
import { SEED_ORDERS } from "../../../../fake-db/seedData.js";
import { nextPrefixedId } from "../../../utils/id.js";

const read = () => readList(KEYS.orders, SEED_ORDERS);

export function getAll() {
  return ok(read(), "Orders loaded.");
}

export function save(input) {
  const list = read();
  const item = { ...input };
  if (!item.id) item.id = nextPrefixedId(list, "ORD");

  if (item.total === undefined || item.total === null || item.total === "") {
    const price = Number(item.price || 0);
    item.total = Math.round((Number(item.quantity) || 0) * price * 100) / 100;
  }
  list.unshift(item);
  if (!writeList(KEYS.orders, list)) {
    return bad("Storage is full — order was not saved.");
  }
  return ok(item, "Order saved.");
}

export function update(id, changes) {
  const list = read();
  const index = list.findIndex((entry) => String(entry.id) === String(id));
  if (index === -1) return bad("Order not found.");
  list[index] = { ...list[index], ...changes, id: list[index].id };
  if (!writeList(KEYS.orders, list)) {
    return bad("Storage is full — order was not saved.");
  }
  return ok(list[index], "Order updated.");
}

export function remove(id) {
  const list = read();
  const next = list.filter((entry) => String(entry.id) !== String(id));
  if (next.length === list.length) return bad("Order not found.");
  if (!writeList(KEYS.orders, next)) {
    return bad("Storage is full — order was not removed.");
  }
  return ok(id, "Order removed.");
}

const apiDefault = { getAll, save, update, remove };
export default apiDefault;
