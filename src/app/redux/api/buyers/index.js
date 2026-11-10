import { KEYS, ok, bad, readList, writeList } from "../index.js";
import { SEED_BUYERS } from "../../../../fake-db/seedData.js";
import { nextPrefixedId } from "../../../utils/id.js";
import { digitsOf } from "../../../utils/validators.js";

const read = () => readList(KEYS.buyers, SEED_BUYERS);

function cnicTaken(list, cnic, ignoreId) {
  return list.some(
    (entry) => digitsOf(entry.cnic) === cnic && String(entry.id) !== String(ignoreId || "")
  );
}

export function getAll() {
  return ok(read(), "Buyers loaded.");
}

/* Duplicate CNIC check happens here, before anything is stored. */
export function save(input) {
  const list = read();
  const cnic = digitsOf(input && input.cnic);
  if (cnic.length !== 13) return bad("CNIC must be exactly 13 digits.");
  if (cnicTaken(list, cnic)) return bad("A buyer with this CNIC already exists.");
  const buyer = { ...input, cnic };
  if (!buyer.id) buyer.id = nextPrefixedId(list, "BYR");
  list.unshift(buyer);
  if (!writeList(KEYS.buyers, list)) {
    return bad("Storage is full — buyer was not saved.");
  }
  return ok(buyer, "Buyer saved.");
}

export function update(id, changes) {
  const list = read();
  const index = list.findIndex((entry) => String(entry.id) === String(id));
  if (index === -1) return bad("Buyer not found.");
  const merged = { ...list[index], ...changes, id: list[index].id };
  if (merged.cnic !== undefined) {
    const cnic = digitsOf(merged.cnic);
    if (cnic.length !== 13) return bad("CNIC must be exactly 13 digits.");
    if (cnicTaken(list, cnic, id)) return bad("A buyer with this CNIC already exists.");
    merged.cnic = cnic;
  }
  list[index] = merged;
  if (!writeList(KEYS.buyers, list)) {
    return bad("Storage is full — buyer was not saved.");
  }
  return ok(merged, "Buyer updated.");
}

export function remove(id) {
  const list = read();
  const next = list.filter((entry) => String(entry.id) !== String(id));
  if (next.length === list.length) return bad("Buyer not found.");
  if (!writeList(KEYS.buyers, next)) {
    return bad("Storage is full — buyer was not removed.");
  }
  return ok(id, "Buyer removed.");
}

const apiDefault = { getAll, save, update, remove };
export default apiDefault;
