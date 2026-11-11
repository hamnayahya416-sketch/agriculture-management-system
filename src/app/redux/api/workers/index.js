import { KEYS, ok, bad, readList, writeList } from "../index.js";
import { SEED_WORKERS } from "../../../../fake-db/seedData.js";
import { nextPrefixedId } from "../../../utils/id.js";

const read = () => readList(KEYS.workers, SEED_WORKERS);

export function getAll() {
  return ok(read(), "Workers loaded.");
}

export function save(input) {
  const list = read();
  const item = { ...input };
  if (!item.id) item.id = nextPrefixedId(list, "WRK");
  list.push(item);
  if (!writeList(KEYS.workers, list)) {
    return bad("Storage is full — worker was not saved.");
  }
  return ok(item, "Worker saved.");
}

export function update(id, changes) {
  const list = read();
  const index = list.findIndex((entry) => String(entry.id) === String(id));
  if (index === -1) return bad("Worker not found.");
  list[index] = { ...list[index], ...changes, id: list[index].id };
  if (!writeList(KEYS.workers, list)) {
    return bad("Storage is full — worker was not saved.");
  }
  return ok(list[index], "Worker updated.");
}

export function remove(id) {
  const list = read();
  const next = list.filter((entry) => String(entry.id) !== String(id));
  if (next.length === list.length) return bad("Worker not found.");
  if (!writeList(KEYS.workers, next)) {
    return bad("Storage is full — worker was not removed.");
  }
  return ok(id, "Worker removed.");
}

const apiDefault = { getAll, save, update, remove };
export default apiDefault;
