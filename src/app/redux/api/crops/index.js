import { KEYS, ok, bad, readList, writeList } from "../index.js";
import { SEED_CROPS } from "../../../../fake-db/seedData.js";
import { nextNumericId } from "../../../utils/id.js";

const read = () => readList(KEYS.crops, SEED_CROPS);

export function getAll() {
  return ok(read(), "Crops loaded.");
}

export function save(crop) {
  const list = read();
  const item = { ...crop };
  if (item.id === undefined || item.id === null || item.id === "") {
    item.id = nextNumericId(list);
  }
  list.push(item);
  if (!writeList(KEYS.crops, list)) return bad("Storage is full — crop was not saved.");
  return ok(item, "Crop added.");
}

export function update(id, changes) {
  const list = read();
  const index = list.findIndex((item) => String(item.id) === String(id));
  if (index === -1) return bad("Crop not found.");
  list[index] = { ...list[index], ...changes, id: list[index].id };
  if (!writeList(KEYS.crops, list)) return bad("Storage is full — crop was not saved.");
  return ok(list[index], "Crop updated.");
}

export function remove(id) {
  const list = read();
  const next = list.filter((item) => String(item.id) !== String(id));
  if (next.length === list.length) return bad("Crop not found.");
  if (!writeList(KEYS.crops, next)) return bad("Storage is full — crop was not removed.");
  return ok(id, "Crop removed.");
}

const apiDefault = { getAll, save, update, remove };
export default apiDefault;
