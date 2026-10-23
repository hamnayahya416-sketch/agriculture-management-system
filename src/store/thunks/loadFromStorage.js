import { createAsyncThunk } from "@reduxjs/toolkit";
import { STORAGE_KEYS, readStorage } from "../../api/storageApi";
import { buildSeedData } from "../../data/seedData";

function asArray(value, fallback) {
  return Array.isArray(value) ? value : fallback;
}

function normalizeInventory(value, fallback) {
  if (Array.isArray(value)) return { items: value, usage: [] };
  if (value && Array.isArray(value.items)) {
    return {
      items: value.items,
      usage: Array.isArray(value.usage) ? value.usage : [],
    };
  }
  return fallback;
}

function normalizeSession(value) {
  if (value && typeof value === "object" && value.user && value.role) {
    return { user: value.user, role: value.role };
  }
  return null;
}

function normalizeUi(value, fallback) {
  if (value && typeof value === "object") {
    return {
      theme: value.theme === "dark" ? "dark" : "light",
      sidebarCollapsed: Boolean(value.sidebarCollapsed),
    };
  }
  return fallback;
}

/* Rehydrates every slice from localStorage; empty/corrupt keys fall back to seed data. */
export const loadFromStorage = createAsyncThunk("app/loadFromStorage", async () => {
  const seed = buildSeedData();
  return {
    crops: asArray(readStorage(STORAGE_KEYS.crops, null), seed.crops),
    orders: asArray(readStorage(STORAGE_KEYS.orders, null), seed.orders),
    buyers: asArray(readStorage(STORAGE_KEYS.buyers, null), seed.buyers),
    tasks: asArray(readStorage(STORAGE_KEYS.tasks, null), seed.tasks),
    expenses: asArray(readStorage(STORAGE_KEYS.expenses, null), seed.expenses),
    inventory: normalizeInventory(readStorage(STORAGE_KEYS.inventory, null), seed.inventory),
    activity: asArray(readStorage(STORAGE_KEYS.activity, null), seed.activity),
    session: normalizeSession(readStorage(STORAGE_KEYS.session, null)),
    ui: normalizeUi(readStorage(STORAGE_KEYS.ui, null), seed.ui),
  };
});

export default loadFromStorage;
