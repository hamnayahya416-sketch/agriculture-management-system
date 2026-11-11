import { KEYS, ok, bad, readList, writeList } from "../index.js";
import { SEED_EQUIPMENT } from "../../../../fake-db/seedData.js";
import { nextPrefixedId } from "../../../utils/id.js";

const read = () => readList(KEYS.equipment, SEED_EQUIPMENT);

export function getAll() {
  return ok(read(), "Equipments loaded.");
}

export function save(input) {
  const list = read();
  const item = { ...input };
  if (!item.id) item.id = nextPrefixedId(list, "EQP");
  list.push(item);
  if (!writeList(KEYS.equipment, list)) {
    return bad("Storage is full — equipment was not saved.");
  }
  return ok(item, "Equipment saved.");
}

export function update(id, changes) {
  const list = read();
  const index = list.findIndex((entry) => String(entry.id) === String(id));
  if (index === -1) return bad("Equipment not found.");
  list[index] = { ...list[index], ...changes, id: list[index].id };
  if (!writeList(KEYS.equipment, list)) {
    return bad("Storage is full — equipment was not saved.");
  }
  return ok(list[index], "Equipment updated.");
}

export function remove(id) {
  const list = read();
  const next = list.filter((entry) => String(entry.id) !== String(id));
  if (next.length === list.length) return bad("Equipment not found.");
  if (!writeList(KEYS.equipment, next)) {
    return bad("Storage is full — equipment was not removed.");
  }
  return ok(id, "Equipment removed.");
}

const apiDefault = { getAll, save, update, remove };
export default apiDefault;
