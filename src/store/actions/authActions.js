import { authSlice } from "../reducers/authReducer";

/* Action types: auth/login, auth/logout, auth/setAuthError, auth/clearAuthError */
export const { login, logout, setAuthError, clearAuthError } = authSlice.actions;

export const ACCOUNTS = [
  { username: "admin", password: "admin123", role: "Admin", displayName: "Admin User" },
  {
    username: "manager",
    password: "manager123",
    role: "Manager",
    displayName: "Farm Manager",
  },
];

export function authenticate(username, password) {
  const user = String(username || "").trim().toLowerCase();
  return (
    ACCOUNTS.find(
      (account) =>
        account.username === user && account.password === String(password || "")
    ) || null
  );
}
