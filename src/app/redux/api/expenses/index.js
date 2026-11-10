import { KEYS, ok, bad, readList, writeList } from "../index.js";
import { SEED_EXPENSES } from "../../../../fake-db/seedData.js";
import { nextPrefixedId } from "../../../utils/id.js";

const read = () => readList(KEYS.expenses, SEED_EXPENSES);

export function getAll() {
  return ok(read(), "Expenses loaded.");
}

export function save(input) {
  const list = read();
  const item = { ...input };
  if (!item.id) item.id = nextPrefixedId(list, "EXP");
  list.unshift(item);
  if (!writeList(KEYS.expenses, list)) {
    return bad("Storage is full — expense was not saved.");
  }
  return ok(item, "Expense saved.");
}

export function update(id, changes) {
  const list = read();
  const index = list.findIndex((entry) => String(entry.id) === String(id));
  if (index === -1) return bad("Expense not found.");
  list[index] = { ...list[index], ...changes, id: list[index].id };
  if (!writeList(KEYS.expenses, list)) {
    return bad("Storage is full — expense was not saved.");
  }
  return ok(list[index], "Expense updated.");
}

export function remove(id) {
  const list = read();
  const next = list.filter((entry) => String(entry.id) !== String(id));
  if (next.length === list.length) return bad("Expense not found.");
  if (!writeList(KEYS.expenses, next)) {
    return bad("Storage is full — expense was not removed.");
  }
  return ok(id, "Expense removed.");
}

const apiDefault = { getAll, save, update, remove };
export default apiDefault;
