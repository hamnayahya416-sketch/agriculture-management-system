import { KEYS, ok, bad, readList, readValue, writeList, writeValue, removeValue } from "../index.js";
import { nextPrefixedId } from "../../../utils/id.js";

/* Built-in accounts plus any custom users saved under agri_users. */
export const ACCOUNTS = [
  { username: "admin", password: "admin123", role: "Admin", displayName: "Admin User" },
  { username: "manager", password: "manager123", role: "Manager", displayName: "Farm Manager" },
];

function customUsers() {
  return readList(KEYS.users, []);
}

function toPublic(user) {
  return { username: user.username, role: user.role, displayName: user.displayName || user.username };
}

function findAccount(username, password) {
  const name = String(username || "").trim().toLowerCase();
  const pass = String(password || "");
  const all = [...ACCOUNTS, ...customUsers()];
  return all.find((account) => account.username === name && account.password === pass) || null;
}

/* ----------------------------------------------------------- session */
export function login(username, password) {
  const account = findAccount(username, password);
  if (!account) return bad("Invalid username or password.");
  const user = toPublic(account);
  if (!writeValue(KEYS.session, { user })) return bad("Could not save the session.");
  return ok(user, `Welcome back, ${user.displayName}!`);
}

export function logout() {
  removeValue(KEYS.session);
  return ok(null, "Logged out.");
}

/* Restores { user } from storage; tolerates the old { user, role } shape. */
export function getSession() {
  const raw = readValue(KEYS.session, null);
  if (!raw) return ok(null, "No saved session.");
  if (raw.user && typeof raw.user === "object") return ok(raw.user, "Session restored.");
  if (raw.user && raw.role) {
    return ok(
      { username: raw.user, role: raw.role, displayName: raw.displayName || raw.user },
      "Session restored."
    );
  }
  return ok(null, "No saved session.");
}

/* ------------------------------------------------------- user records */
export function getAllUsers() {
  return ok(customUsers(), "Users loaded.");
}

export function getUser(username) {
  const found = customUsers().find(
    (user) => user.username === String(username || "").trim().toLowerCase()
  );
  if (!found) return bad("User not found.");
  return ok(found, "User loaded.");
}

export function createUser(input) {
  const users = customUsers();
  const username = String(input.username || "").trim().toLowerCase();
  if (!username) return bad("Username is required.");
  if (!input.password || String(input.password).length < 6) {
    return bad("Password must be at least 6 characters.");
  }
  if (ACCOUNTS.some((account) => account.username === username) || users.some((u) => u.username === username)) {
    return bad("That username is already taken.");
  }
  const user = {
    id: nextPrefixedId(users, "USR"),
    username,
    password: String(input.password),
    role: input.role === "Manager" ? "Manager" : "Admin",
    displayName: input.displayName || username,
  };
  users.push(user);
  if (!writeList(KEYS.users, users)) return bad("Storage is full — user was not saved.");
  return ok(user, "User created.");
}

export function updateUser(username, changes) {
  const users = customUsers();
  const index = users.findIndex((u) => u.username === String(username || "").trim().toLowerCase());
  if (index === -1) return bad("User not found.");
  users[index] = { ...users[index], ...changes, username: users[index].username };
  if (users[index].role !== "Manager" && users[index].role !== "Admin") users[index].role = "Admin";
  if (!writeList(KEYS.users, users)) return bad("Storage is full — user was not saved.");
  return ok(users[index], "User updated.");
}

export function removeUser(username) {
  const users = customUsers();
  const next = users.filter((u) => u.username !== String(username || "").trim().toLowerCase());
  if (next.length === users.length) return bad("User not found.");
  if (!writeList(KEYS.users, next)) return bad("Storage is full — user was not removed.");
  return ok(username, "User removed.");
}

const apiDefault = {
  login,
  logout,
  getSession,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  removeUser,
};
export default apiDefault;
