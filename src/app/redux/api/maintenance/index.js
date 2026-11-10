import { KEYS, ok, bad, readList, writeList } from "../index.js";
import { nextPrefixedId } from "../../../utils/id.js";

const read = () => readList(KEYS.maintenance, []);

export function getAll() {
  return ok(read(), "Services loaded.");
}

export function save(input) {
  const list = read();
  const item = { ...input };
  if (!item.id) item.id = nextPrefixedId(list, "SVC");
  list.push(item);
  if (!writeList(KEYS.maintenance, list)) {
    return bad("Storage is full — service was not saved.");
  }
  return ok(item, "Service saved.");
}

export function update(id, changes) {
  const list = read();
  const index = list.findIndex((entry) => String(entry.id) === String(id));
  if (index === -1) return bad("Service not found.");
  list[index] = { ...list[index], ...changes, id: list[index].id };
  if (!writeList(KEYS.maintenance, list)) {
    return bad("Storage is full — service was not saved.");
  }
  return ok(list[index], "Service updated.");
}

export function remove(id) {
  const list = read();
  const next = list.filter((entry) => String(entry.id) !== String(id));
  if (next.length === list.length) return bad("Service not found.");
  if (!writeList(KEYS.maintenance, next)) {
    return bad("Storage is full — service was not removed.");
  }
  return ok(id, "Service removed.");
}

const apiDefault = { getAll, save, update, remove };
export default apiDefault;
