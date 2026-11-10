import { KEYS, ok, bad, readList, writeList } from "../index.js";
import { SEED_TASKS } from "../../../../fake-db/seedData.js";
import { nextPrefixedId } from "../../../utils/id.js";

const read = () => readList(KEYS.tasks, SEED_TASKS);

export function getAll() {
  return ok(read(), "Tasks loaded.");
}

export function save(input) {
  const list = read();
  const item = { ...input };
  if (!item.id) item.id = nextPrefixedId(list, "TSK");
  list.push(item);
  if (!writeList(KEYS.tasks, list)) {
    return bad("Storage is full — task was not saved.");
  }
  return ok(item, "Task saved.");
}

export function update(id, changes) {
  const list = read();
  const index = list.findIndex((entry) => String(entry.id) === String(id));
  if (index === -1) return bad("Task not found.");
  list[index] = { ...list[index], ...changes, id: list[index].id };
  if (!writeList(KEYS.tasks, list)) {
    return bad("Storage is full — task was not saved.");
  }
  return ok(list[index], "Task updated.");
}

export function remove(id) {
  const list = read();
  const next = list.filter((entry) => String(entry.id) !== String(id));
  if (next.length === list.length) return bad("Task not found.");
  if (!writeList(KEYS.tasks, next)) {
    return bad("Storage is full — task was not removed.");
  }
  return ok(id, "Task removed.");
}

const apiDefault = { getAll, save, update, remove };
export default apiDefault;
