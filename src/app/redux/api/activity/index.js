import { KEYS, ok, bad, readValue, writeValue, removeValue } from "../index.js";
import { SEED_ACTIVITY } from "../../../../fake-db/seedData.js";
import { nextPrefixedId } from "../../../utils/id.js";

const MAX_ENTRIES = 300;

/* Storage may hold a bare array (old build) or { logs: [...] }. */
function read() {
  const raw = readValue(KEYS.activity, null);
  if (raw === null || raw === undefined) return [...SEED_ACTIVITY];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.logs)) return raw.logs;
  if (Array.isArray(raw.items)) return raw.items; // old { items } shape
  return [];
}

export function getAll() {
  return ok(read(), "Activity loaded.");
}

export function log(entry) {
  const list = read();
  const record = { ...entry };
  if (!record.id) record.id = nextPrefixedId(list, "ACT");
  if (!record.timestamp) record.timestamp = new Date().toISOString();
  list.unshift(record);
  if (list.length > MAX_ENTRIES) list.length = MAX_ENTRIES;
  if (!writeValue(KEYS.activity, list)) return bad("Storage is full — log entry was not saved.");
  return ok(list, "Log entry saved.");
}

export function clear() {
  if (!removeValue(KEYS.activity)) return bad("Could not clear the activity log.");
  return ok([], "Activity log cleared.");
}

const apiDefault = { getAll, log, clear };
export default apiDefault;
