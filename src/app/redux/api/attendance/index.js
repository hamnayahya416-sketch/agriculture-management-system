import { KEYS, ok, bad, readList, writeList } from "../index.js";
import { SEED_ATTENDANCE } from "../../../../fake-db/seedData.js";
import { nextPrefixedId } from "../../../utils/id.js";

const read = () => readList(KEYS.attendance, SEED_ATTENDANCE);

function hasDuplicate(list, workerId, date, ignoreId) {
  return list.some(
    (entry) =>
      String(entry.workerId) === String(workerId) &&
      entry.date === date &&
      String(entry.id) !== String(ignoreId || "")
  );
}

export function getAll() {
  return ok(read(), "Attendance loaded.");
}

/* One record per worker per day — duplicates are blocked here. */
export function save(input) {
  const list = read();
  if (!input || !input.workerId || !input.date) {
    return bad("Worker and date are required.");
  }
  if (hasDuplicate(list, input.workerId, input.date)) {
    return bad("Attendance is already marked for this worker on that date.");
  }
  const record = { ...input, id: nextPrefixedId(list, "ATT") };
  list.push(record);
  if (!writeList(KEYS.attendance, list)) {
    return bad("Storage is full — attendance was not saved.");
  }
  return ok(record, "Attendance marked.");
}

export function update(id, changes) {
  const list = read();
  const index = list.findIndex((entry) => String(entry.id) === String(id));
  if (index === -1) return bad("Attendance record not found.");
  const merged = { ...list[index], ...changes, id: list[index].id };
  if (hasDuplicate(list, merged.workerId, merged.date, id)) {
    return bad("Another record already exists for this worker on that date.");
  }
  list[index] = merged;
  if (!writeList(KEYS.attendance, list)) {
    return bad("Storage is full — attendance was not saved.");
  }
  return ok(merged, "Attendance updated.");
}

export function remove(id) {
  const list = read();
  const next = list.filter((entry) => String(entry.id) !== String(id));
  if (next.length === list.length) return bad("Attendance record not found.");
  if (!writeList(KEYS.attendance, next)) {
    return bad("Storage is full — attendance was not removed.");
  }
  return ok(id, "Attendance removed.");
}

const apiDefault = { getAll, save, update, remove };
export default apiDefault;
